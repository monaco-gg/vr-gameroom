import mongoose from "mongoose";

/**
 * @typedef {Object} Ticket
 * @property {mongoose.Types.ObjectId} user - Reference to the User document.
 * @property {string} gameId - The id of the game.
 * @property {number} amount - The amount associated with the ticket.
 * @property {Date} createdAt - The date when the ticket was created.
 * @type {mongoose.Schema<Ticket>}
 */
const TicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Create an index on the user field
  },
  gameId: {
    type: String,
    required: false,
  },
  playerData: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    default: {},
  },
  amount: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Create an index on the createdAt field to improve performance on date-based queries
  },
});

/**
 * Exports the Ticket model.
 * If the model already exists, it uses the existing model to avoid recompiling the schema.
 * This is particularly useful in serverless environments like Next.js to prevent model compilation issues.
 * @type {mongoose.Model<Ticket>}
 */
export default mongoose.models.Tickets ||
  mongoose.model("Tickets", TicketSchema);
