import mongoose, { Document, Schema } from "mongoose";

export interface ICommunity extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  creator: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}

// Define the schema for the community model
const CommunitySchema: Schema<ICommunity> = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
      index: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Pre-save middleware to update the `updatedAt` field
CommunitySchema.pre<ICommunity>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Add compound indexes if needed
CommunitySchema.index({ creator: 1, name: 1 });

/**
 * The Community model represents a group of users competing in a ranking.
 *
 * @typedef {ICommunity} Community
 * @property {string} name - The auto-generated name of the community.
 * @property {Schema.Types.ObjectId} creator - Reference to the user who created the community.
 * @property {Schema.Types.ObjectId[]} members - Array of references to users who are members of the community.
 * @property {Date} createdAt - The date when the community was created.
 * @property {Date} [updatedAt] - The date when the community was last updated.
 */
const CommunityModel =
  mongoose.models.Community ||
  mongoose.model<ICommunity>("Community", CommunitySchema);
export default CommunityModel;
