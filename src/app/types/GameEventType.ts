import { ObjectId } from 'mongoose';
import { WinnerType } from './WinnerType'; // Importe o tipo Winner

/**
 * Represents a game event.
 * @typedef {Object} GameEvent
 * @property {ObjectId} _id - Unique identifier for the game event.
 * @property {string} [title] - Title of the game event.
 * @property {string} [description] - Description of the game event.
 * @property {Date} createdAt - Date when the event was created.
 * @property {Date} startDate - Start date of the game event.
 * @property {Date} endDate - End date of the game event.
 * @property {Winner[]} winners - List of winners in the game event.
 */
export type GameEventType = {
  _id: ObjectId;
  title?: string;
  description?: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  winners: WinnerType[];
}
