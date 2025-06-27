import mongoose from "mongoose";

/**
 * @typedef {Object} GameHistory
 * @property {mongoose.Schema.Types.ObjectId} userId - Reference to the Users document.
 * @property {string} gameId - The ID of the game.
 * @property {number} coinsUsed - The number of coins used in the game.
 * @property {Date} createdAt - The date when the game history was created.
 * @type {mongoose.Schema<GameHistory>}
 */
const GameHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true, // Create an index on the userId field
  },
  gameId: {
    type: String,
    required: true,
    index: true, // Create an index on the gameId field
  },
  coinsUsed: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Create an index on the createdAt field to improve performance on date-based queries
  },
});

/**
 * Exports the GameHistory model.
 * If the model already exists, it uses the existing model to avoid recompiling the schema.
 * This is particularly useful in serverless environments like Next.js to prevent model compilation issues.
 * @type {mongoose.Model<GameHistory>}
 */
export default mongoose.models.GameHistories ||
  mongoose.model("GameHistories", GameHistorySchema);
