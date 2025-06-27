import mongoose from "mongoose";

/**
 * @typedef {Object} Notification
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user associated with the notification.
 * @property {string} title - The title of the notification.
 * @property {string} message - The message content of the notification.
 * @property {string} type - The type of the notification, restricted to specific values.
 * @property {Date} createdAt - The date when the notification was created.
 * @property {Date} readAt - The date when the notification was read, null by default.
 * @property {string} status - The status of the notification, either "new" or "read".
 * @property {string} url - An optional URL associated with the notification.
 * @property {Object} data - Additional data associated with the notification.
 * @type {mongoose.Schema<Notification>}
 */
const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true, // Create an index on the userId field
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "warning",
      "message",
      "invite",
      "renew-coins",
      "referral-completed",
      "acquired-coins",
    ],
    index: true, // Create an index on the type field
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Create an index on the createdAt field to improve performance on date-based queries
  },
  readAt: {
    type: Date,
    default: null,
    index: true, // Create an index on the readAt field
  },
  status: {
    type: String,
    required: true,
    enum: ["new", "read"],
    default: "new",
    index: true, // Create an index on the status field
  },
  url: {
    type: String,
    trim: true,
    default: "",
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Add compound indexes if needed
NotificationSchema.index({ userId: 1, createdAt: -1 }); // Compound index on userId and createdAt for better search performance

/**
 * Exports the Notification model.
 * If the model already exists, it uses the existing model to avoid recompiling the schema.
 * This is particularly useful in serverless environments like Next.js to prevent model compilation issues.
 * @type {mongoose.Model<Notification>}
 */
export default mongoose.models.Notifications ||
  mongoose.model("Notifications", NotificationSchema);
