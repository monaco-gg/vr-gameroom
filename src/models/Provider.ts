import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Enum representing the available provider IDs.
 * @enum {string}
 */
export enum ProviderID {
  google = 'google',
  discord = 'discord'
}

/**
 * Interface representing the Provider document in MongoDB.
 * @interface IProvider
 * @extends {Document}
 */
export interface IProvider extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  providerAccountId?: string;
  provider: ProviderID;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scope?: string;
  tokenType?: string;
  idToken?: string;
  createdAt?: Date;
}

/**
 * Mongoose schema definition for the Provider model.
 * @const {Schema<IProvider>}
 */
const ProviderSchema: Schema<IProvider> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  providerAccountId: {
    type: String,
  },
  provider: {
    type: String,
    enum: Object.values(ProviderID), // Ensures provider matches the enum values
    required: true,
    index: true,
  },
  accessToken: {
    type: String,
  },
  scope: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

/**
 * Mongoose model for the Provider schema.
 * @const {Model<IProvider>}
 */
const ProviderModel: Model<IProvider> = mongoose.models.Providers || mongoose.model<IProvider>("Providers", ProviderSchema);

export default ProviderModel;
