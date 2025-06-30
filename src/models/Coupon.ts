import mongoose, { Document, Schema } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  remainingUses: number;
  expirationDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema<ICoupon> = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"],
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  remainingUses: {
    type: Number,
    default: 1,
    min: 1,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

CouponSchema.index({ isActive: 1, expirationDate: 1 });

CouponSchema.pre<ICoupon>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const CouponModel =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;
