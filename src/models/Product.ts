import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface representing a Product document in MongoDB.
 */
export interface IProduct extends Document {
  name: string;
  category: string;
  quantity: number;
  price: number;
  coinsAmount?: number;
  description?: string;
  image?: string;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose schema for the Product model.
 */
const ProductSchema: Schema<IProduct> = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    index: true, // Creates an index on the name field for improved search performance
  },
  category: {
    type: String,
    required: true,
    index: true, // Creates an index on the category field
  },
  quantity: {
    type: Number,
    required: true,
    min: 0, // Ensures quantity is not negative
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures price is not negative
  },
  coinsAmount: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  priority: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Adds compound indexes if necessary
ProductSchema.index({ name: 1, category: 1 }); // Compound index on name and category for better search performance

/**
 * Exports the Product model.
 * If the model already exists, it uses the existing model to avoid recompiling the schema.
 * This is particularly useful in serverless environments like Next.js to prevent model compilation issues.
 */
const ProductModel: Model<IProduct> =
  mongoose.models.Products || mongoose.model<IProduct>("Products", ProductSchema);

export default ProductModel;
