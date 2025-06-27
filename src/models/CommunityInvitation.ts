import mongoose, { Document, Schema } from "mongoose";

export interface ICommunityInvitation extends Document {
  _id: Schema.Types.ObjectId;
  community: Schema.Types.ObjectId;
  inviter: Schema.Types.ObjectId;
  code: string;
  expiresAt: Date;
  usageCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

// Define the schema for the community invitation model
const CommunityInvitationSchema: Schema<ICommunityInvitation> = new Schema({
  community: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    required: true,
    index: true,
  },
  inviter: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Pre-save middleware to update the `updatedAt` field
CommunityInvitationSchema.pre<ICommunityInvitation>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Add compound indexes
CommunityInvitationSchema.index({ community: 1, code: 1 });
CommunityInvitationSchema.index({ expiresAt: 1 });

/**
 * The CommunityInvitation model represents an invitation to join a community.
 *
 * @typedef {ICommunityInvitation} CommunityInvitation
 * @property {Schema.Types.ObjectId} community - Reference to the community the invitation is for.
 * @property {Schema.Types.ObjectId} inviter - Reference to the user who created the invitation.
 * @property {string} code - The unique invitation code.
 * @property {Date} expiresAt - The date when the invitation expires (48 hours after creation).
 * @property {number} usageCount - The number of times the invitation has been used.
 * @property {Date} createdAt - The date when the invitation was created.
 * @property {Date} [updatedAt] - The date when the invitation was last updated.
 */
const CommunityInvitationModel =
  mongoose.models.CommunityInvitation ||
  mongoose.model<ICommunityInvitation>(
    "CommunityInvitation",
    CommunityInvitationSchema
  );

export default CommunityInvitationModel;
