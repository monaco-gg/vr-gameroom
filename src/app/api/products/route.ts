// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Product, { IProduct } from "@models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * Creates a new product in the database.
 * @param {IProduct} productData - The data of the product to create.
 * @returns {Promise<IProduct>} The created product document.
 */
async function createProduct(productData: IProduct): Promise<IProduct> {
  await dbConnect();
  return Product.create(productData);
}

/**
 * Retrieves all products from the database.
 * @returns {Promise<IProduct[]>} A list of all product documents.
 */
async function getProducts(): Promise<IProduct[]> {
  await dbConnect();
  return Product.find({}).sort({ priority: 1 });
}

/**
 * Handles POST requests to create a new product.
 * @param {NextRequest} req - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} The response indicating success or failure.
 */
async function handlePostRequest(req: NextRequest): Promise<NextResponse> {
  try {
    const productData = (await req.json()) as IProduct;
    const product = await createProduct(productData);
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * Handles GET requests to retrieve all products.
 * @returns {Promise<NextResponse>} The response with the list of products or an error message.
 */
async function handleGetRequest(): Promise<NextResponse> {
  try {
    const products = await getProducts();
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * API route to handle POST requests for creating a new product.
 * @param {NextRequest} req - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handlePostRequest(req);
}

/**
 * API route to handle GET requests to retrieve all products.
 * @param {NextRequest} req - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handleGetRequest();
}
