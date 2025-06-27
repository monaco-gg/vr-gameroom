import mongoose from "mongoose";

/**
 * @typedef {Object} Game
 * @property {string} name - The name of the game.
 * @property {string} description - A description of the game.
 * @property {Date} createdAt - The date when the game was created.
 * @type {mongoose.Schema<Game>}
 */
const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure the game name is unique
    index: true, // Create an index on the name field
  },
  description: {
    type: String,
    required: true,
    index: true, // Create an index on the description field for full-text search
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Create an index on the createdAt field to improve performance on date-based queries
  },
});

/**
 * Exports the Game model.
 * If the model already exists, it uses the existing model to avoid recompiling the schema.
 * This is particularly useful in serverless environments like Next.js to prevent model compilation issues.
 * @type {mongoose.Model<Game>}
 */
export default mongoose.models.Games || mongoose.model("Games", GameSchema);
