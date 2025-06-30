import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Order from "@models/Order";
import User from "@models/User";
import Coupon from "@models/Coupon";
import { getServerSession } from "next-auth/next";
import { generatePixQRCode as generateAsaasPixQRCode } from "@helpers/asaasService";
import { generatePixQRCode as generateStarkbankPixQRCode } from "@helpers/starkbankService";
import { sendSlackMessage } from "@helpers/slack";
import { formatToBRL } from "@utils/index";
import { Session } from "next-auth";
import ProductModel from "@models/Product";

// Utility functions
const getNextDayDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split("T")[0];
};

const createErrorResponse = (message: string, status: number) => {
  return NextResponse.json({ success: false, message }, { status });
};

const createSuccessResponse = (data: any, message: string, status: number) => {
  return NextResponse.json({ success: true, message, data }, { status });
};

// Coupon-related functions
const validateCoupon = async (couponCode: string, userId: string) => {
  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon || !coupon.isActive) {
    throw new Error("Invalid coupon");
  }

  const user = await User.findById(userId);
  if (user.usedCoupons && user.usedCoupons.includes(couponCode)) {
    throw new Error("Coupon already used by this user");
  }

  return coupon;
};

const markCouponAsUsed = async (userId: string, couponCode: string) => {
  await User.findByIdAndUpdate(userId, {
    $addToSet: { usedCoupons: couponCode },
  });
};

const decrementCouponUses = async (couponCode: string) => {
  await Coupon.findOneAndUpdate(
    { code: couponCode },
    { $inc: { remainingUses: -1 } }
  );
};

// Order-related functions
const createOrder = async (orderData: any) => {
  await dbConnect();
  const user = await User.findById(orderData.user);
  if (!user) throw new Error("User not found for the given userId");

  let coupon;
  if (orderData.couponCode) {
    coupon = await validateCoupon(orderData.couponCode, orderData.user);
  }

  const order = await Order.create(orderData);
  const pixData = await generatePixData(order, user);

  await updateOrderWithPixData(order, pixData);
  await sendSlackNotification(order, user);

  if (coupon) {
    await markCouponAsUsed(orderData.user, orderData.couponCode);
    await decrementCouponUses(orderData.couponCode);
  }

  return order;
};

const updateOrder = async (id: string, updateData: any) => {
  await dbConnect();
  return Order.findByIdAndUpdate(id, updateData, { new: true });
};

const getOrders = async (userId: string) => {
  await dbConnect();
  return Order.find({ user: userId })
    .populate({
      path: "items.product",
      model: ProductModel,
    })
    .exec();
};

async function getUserByEmail(email: string) {
  await dbConnect();
  return User.findOne({ email });
}

const deleteOrder = async (id: string) => {
  await dbConnect();
  return Order.findByIdAndDelete(id);
};

// Helper functions
const generatePixData = async (order: any, user: any) => {
  const { paymentProvider } = order;
  const dueDate = getNextDayDate();

  if (paymentProvider === "asaas") {
    const customerId = user.paymentProviders?.[paymentProvider];
    if (!customerId)
      throw new Error(
        `Customer not found for the given userId in provider ${paymentProvider}`
      );

    return generateAsaasPixQRCode({
      customerId,
      amount: order.totalAmount,
      dueDate,
      description: `Pagamento do pedido ${order._id}`,
    });
  } else if (paymentProvider === "starkbank") {
    return generateStarkbankPixQRCode({
      amount: order.totalAmount,
      expiration: 3600,
      tags: [order._id.toString()],
    });
  }

  throw new Error("Invalid payment provider");
};

const updateOrderWithPixData = async (order: any, pixData: any) => {
  if (!pixData) throw new Error("Failed to generate PIX QR Code.");

  order.paymentProviderReferenceId = pixData.paymentProviderId || "";
  order.pixQRCode = pixData.encodedImage || "";
  order.pixKey = pixData.payload || "";
  order.paymentStatus = "pending";
  await order.save();
};

const sendSlackNotification = async (order: any, user: any) => {
  if (process.env.SLACK_HOOK_ORDER_URL) {
    try {
      await sendSlackMessage(`
📄  *Pedido Criado:* ✨
👤  Cliente: ${user.name}
🛒  Produto: ${order.items[0]?.product}
💵  Valor: ${formatToBRL(order.totalAmount)}
🟡  Status: ${order.paymentStatus}
#️⃣  Provedor: ${order.paymentProvider.toUpperCase()}
      `);
    } catch (e) {
      console.log(e);
    }
  }
};

// Request handlers
const handlePostRequest = async (req: NextRequest) => {
  try {
    const orderData = await req.json();
    const order = await createOrder(orderData);
    return createSuccessResponse(order, "Order created successfully", 201);
  } catch (err) {
    if (err instanceof Error) {
      return createErrorResponse(err.message, 400);
    }
    return createErrorResponse("An unexpected error occurred", 500);
  }
};

const handlePutRequest = async (req: NextRequest) => {
  try {
    const { id, ...updateData } = await req.json();
    const order = await updateOrder(id, updateData);
    if (!order) return createErrorResponse("Order not found", 404);
    return createSuccessResponse(order, "Order updated successfully", 200);
  } catch (err) {
    return createErrorResponse("An unexpected error occurred", 500);
  }
};

const handleGetRequest = async (req: NextRequest, session: Session) => {
  try {
    if (!session?.user?.email) {
      return createErrorResponse("User not found in session", 401);
    }
    const existingUser = await getUserByEmail(session.user.email);
    const orders = await getOrders(existingUser._id.toString());
    return createSuccessResponse(orders, "", 200);
  } catch (err) {
    return createErrorResponse("An unexpected error occurred", 500);
  }
};

const handleDeleteRequest = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return createErrorResponse("Order ID is required", 400);

    const order = await deleteOrder(id);
    if (!order) return createErrorResponse("Order not found", 404);
    return createSuccessResponse(null, "Order deleted successfully", 200);
  } catch (err) {
    return createErrorResponse("An unexpected error occurred", 500);
  }
};

// Authentication middleware
const withAuth = (
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) => {
  return async (req: NextRequest) => {
    const session = await getServerSession();
    if (!session) return createErrorResponse("Authentication required", 401);
    return handler(req, session);
  };
};

// Exported request handlers
export const POST = withAuth(handlePostRequest);
export const PUT = withAuth(handlePutRequest);
export const GET = withAuth(handleGetRequest);
export const DELETE = withAuth(handleDeleteRequest);
