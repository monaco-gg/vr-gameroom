import { ObjectId } from 'mongoose';

/**
 * Represents a winner in a game event.
 * @typedef {Object} Winner
 * @property {ObjectId} UserId - Reference to the user who won.
 * @property {number} matches - Number of matches won.
 * @property {number} tickets - Number of tickets won.
 * @property {number} position - Position of the winner.
 * @property {Date} createdAt - Date when the winner was recorded.
 * @property {string} [nickname] - Nickname of the winner.
 * @property {string} [photo] - URL of the winner's photo.
 */
export type WinnerType = {
  userId: ObjectId;
  matches: number;
  tickets: number;
  position: number;
  createdAt: Date;
  nickname?: string;
  photo?: string;
};
