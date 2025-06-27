import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Winner Schema
 * @typedef {Object} WinnerSchema
 * @property {mongoose.ObjectId} UserId - Reference to the user who won
 * @property {number} matches - Number of matches won
 * @property {number} tickets - Number of tickets won
 * @property {number} position - Position of the winner
 * @property {Date} createdAt - Date when the winner was recorded
 */
const WinnerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true,
  },
  matches: {
    type: Number,
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

/**
 * GameEvent Schema
 * @typedef {Object} GameEventSchema
 * @property {mongoose.ObjectId} userId - Reference to the user who created the event
 * @property {string} title - Title of the game event
 * @property {string} description - Description of the game event
 * @property {Date} createdAt - Date when the event was created
 * @property {Date} startDate - Start date of the game event
 * @property {Date} endDate - End date of the game event
 * @property {Array<WinnerSchema>} winners - List of winners in the game event
 */
const GameEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  startDate: {
    type: Date,
    required: true,
    index: true,
  },
  endDate: {
    type: Date,
    required: true,
    index: true,
  },
  winners: {
    type: [WinnerSchema],
    default: [],
  },
});

export default mongoose.models.GameEvents ||
  mongoose.model("GameEvents", GameEventSchema);
