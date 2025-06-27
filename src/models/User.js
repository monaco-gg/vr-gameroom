import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {string} email - The email address of the user.
 * @property {string} name - The name of the user.
 * @property {string} [photo] - The URL of the user's photo.
 * @property {string} [nickname] - The nickname of the user.
 * @property {Date} [dateOfBirth] - The birth date of the user.
 * @property {string} [phone] - The phone number of the user.
 * @property {number} [coinsAvailable=3] - The number of coins available for the user.
 * @property {Date} [lastCoinsRenewal=Date.now] - The date when the user's coins were last renewed.
 * @property {Date} [createdAt=Date.now] - The date when the user was created.
 * @property {string} referralCode - The unique referral code of the user.
 * @property {mongoose.Schema.Types.ObjectId} [referredBy] - The user who referred this user.
 * @property {string} [tokenDevice] - The device token for notifications.
 * @property {boolean} [enableNotifications] - Whether notifications are enabled for the user.
 * @property {Object} paymentProviders - Object containing the customer IDs for each payment provider.
 * @property {string} paymentProviders.asaas - Customer ID for Asaas.
 * @property {string} paymentProviders.starkbank - Customer ID for Stark Bank.
 * @type {mongoose.Schema<User>}
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  cpfCnpj: {
    type: String,
  },
  paymentProviders: {
    asaas: {
      type: String,
    },
    starkbank: {
      type: String,
    },
  },
  photo: {
    type: String,
  },
  nickname: {
    type: String,
    index: true,
  },
  dateOfBirth: {
    type: Date,
  },
  phone: {
    type: String,
    index: true,
  },
  coinsAvailable: {
    type: Number,
    default: 3,
  },
  lastCoinsRenewal: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  referralCode: {
    type: String,
    unique: true,
    index: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    index: true,
  },
  tokenDevice: {
    type: String,
    index: true,
  },
  enableNotifications: {
    type: Boolean,
  },
  usedCoupons: [
    {
      type: String,
      ref: "Coupon",
    },
  ],
});

// Add compound indexes if needed
UserSchema.index({ email: 1, name: 1 });

/**
 * Exports the User model.
 * If the model already exists, it uses the existing model to avoid recompiling the schema.
 * This is particularly useful in serverless environments like Next.js to prevent model compilation issues.
 * @type {mongoose.Model<User>}
 */
export default mongoose.models.Users || mongoose.model("Users", UserSchema);
