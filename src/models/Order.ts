import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "pix" | "credit_card" | "boleto";
  paymentProvider: "asaas" | "starkbank";
  paymentProviderReferenceId?: string;
  pixQRCode?: string;
  pixKey?: string;
  couponCode?: string;
  shippingAddress?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Define the schema for the order model
const OrderSchema: Schema<IOrder> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["pix", "credit_card", "boleto"],
    default: "pix",
  },
  paymentProvider: {
    type: String,
    required: true,
    enum: ["asaas", "starkbank"],
  },
  paymentProviderReferenceId: {
    type: String,
  },
  pixQRCode: {
    type: String,
  },
  pixKey: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  couponCode: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Pre-save middleware to update the `updatedAt` field
OrderSchema.pre<IOrder>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

/**
 * The Order model represents an order placed by a user, including details
 * about the items, payment, and shipping information.
 *
 * @typedef {IOrder} Order
 * @property {Schema.Types.ObjectId} user - Reference to the user who placed the order.
 * @property {IOrderItem[]} items - List of items included in the order.
 * @property {number} totalAmount - The total amount for the order.
 * @property {"pending" | "processing" | "completed" | "cancelled"} status - The current status of the order.
 * @property {"pending" | "paid" | "failed"} paymentStatus - The current status of the payment.
 * @property {"pix" | "credit_card" | "boleto"} paymentMethod - The method used for payment.
 * @property {"asaas" | "starkbank" } paymentProvider - The method used for payment.
 * @property {string} [paymentProviderReferenceId] - Optional ID for the payment in the provider system.
 * @property {string} [pixQRCode] - Optional QR code for Pix payment.
 * @property {string} [pixKey] - Optional Pix key for the payment.
 * @property {string} [shippingAddress] - Optional shipping address for the order.
 * @property {Date} createdAt - The date when the order was created.
 * @property {Date} [updatedAt] - The date when the order was last updated.
 */
const OrderModel =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
