import dbConnect from "@helpers/dbConnect";
import Order from "@models/Order";
import User from "@models/User";
import Product from "@models/Product";
import Notification from "@models/Notification";
import { sendSlackMessage } from "@helpers/slack";
import { formatToBRL } from "@utils/index";

export async function updateOrderAndAddCoins(
  paymentProviderReferenceId: string,
  status: string
) {
  await dbConnect();

  const updatedOrder = await updateOrderStatus(
    paymentProviderReferenceId,
    status
  );
  if (!updatedOrder) return;

  const orderDetails = await getOrderDetails(paymentProviderReferenceId);
  if (!orderDetails || !orderDetails.user) return;

  const totalCoinsToAdd = calculateTotalCoins(orderDetails.items);
  const updatedUser = await addCoinsToUser(
    orderDetails.user._id,
    totalCoinsToAdd
  );
  if (!updatedUser) return;

  await createNotification(orderDetails.user._id);
  await sendOrderCompletionMessage(
    updatedUser,
    orderDetails,
    paymentProviderReferenceId
  );
}

async function updateOrderStatus(
  paymentProviderReferenceId: string,
  status: string
) {
  return Order.findOneAndUpdate(
    { paymentProviderReferenceId },
    { paymentStatus: status, status: "completed" },
    { new: true }
  );
}

async function getOrderDetails(paymentProviderReferenceId: string) {
  const order = await Order.findOne({ paymentProviderReferenceId });
  if (!order) throw new Error("Order not found");

  const itemsWithProductDetails = await Promise.all(
    order.items.map(async (item: { product: any; toObject: () => any }) => {
      const product = await Product.findById(item.product);
      return {
        ...item.toObject(),
        product: product ? product.toObject() : null,
      };
    })
  );

  return { ...order.toObject(), items: itemsWithProductDetails };
}

function calculateTotalCoins(items: any[]): number {
  return items.reduce((total, item) => {
    return total + (item.product?.coinsAmount || 0) * item.quantity;
  }, 0);
}

async function addCoinsToUser(userId: string, coinsToAdd: number) {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { coinsAvailable: coinsToAdd } },
    { new: true }
  );
}

async function createNotification(userId: string) {
  await Notification.create({
    title: "Compra concluída",
    message:
      "Sua compra foi realizada com sucesso e as fichas foram depositadas na sua conta",
    type: "acquired-coins",
    status: "new",
    userId,
  });
}

async function sendOrderCompletionMessage(
  user: any,
  orderDetails: any,
  paymentProviderReferenceId: string
) {
  if (process.env.SLACK_HOOK_ORDER_URL) {
    try {
      await sendSlackMessage(`
📄  *Pedido Concluído:* ✨
👤  Cliente: ${user.name}
🛒  Produto: ${orderDetails.items[0]?.product?._id}
💵  Valor: ${formatToBRL(orderDetails.totalAmount)}
🟢  Status: ${orderDetails.paymentStatus}
#️⃣  Referência: ${paymentProviderReferenceId}
`);
    } catch (e) {
      console.error(e);
    }
  }
}
