// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Product from "@models/Product";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth/next";

/**
 * Updates a product by its ID.
 * @param {string} id - The ID of the product to update.
 * @param {Record<string, any>} updateData - The data to update the product with.
 * @returns {Promise<Document | null>} The updated product document or null if not found.
 */
async function updateProduct(id: string, updateData: Record<string, any>) {
  await dbConnect();
  return Product.findByIdAndUpdate(id, updateData, { new: true });
}

/**
 * Retrieves a product by its ID.
 * @param {string} id - The ID of the product to retrieve.
 * @returns {Promise<Document | null>} The product document or null if not found.
 */
async function getProduct(id: string): Promise<Document | null> {
  try {
    await dbConnect();
    return await Product.findById(id);
  } catch (e) {
    return null;
  }
}

/**
 * Deletes a product by its ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<Document | null>} The deleted product document or null if not found.
 */
async function deleteProduct(id: string): Promise<Document | null> {
  await dbConnect();
  return Product.findByIdAndDelete(id);
}

/**
 * Handles PUT requests to update a product.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object.
 */
async function handlePutRequest(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, ...updateData } = await req.json();
    const product = await updateProduct(id, updateData);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: product,
      },
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
 * Handles GET requests to retrieve a product by its ID.
 * @param {string} id - The ID of the product to retrieve.
 * @returns {Promise<NextResponse>} The response object.
 */
async function handleGetRequest(id: string): Promise<NextResponse> {
  try {
    const product = await getProduct(id);

    if (product) {
      return NextResponse.json(
        { success: true, data: product },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: null, message: "Product not found" },
      { status: 404 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * Handles DELETE requests to remove a product by its ID.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object.
 */
async function handleDeleteRequest(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await deleteProduct(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
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
 * API Route handler for PUT requests.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handlePutRequest(req);
}

/**
 * API Route handler for GET requests.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {Object} route - The route parameters.
 * @param {string} route.params.id - The ID of the product to retrieve.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function GET(
  req: NextApiRequest,
  route: { params: { id: string } }
): Promise<NextResponse> {
  const {
    params: { id },
  } = route;
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handleGetRequest(id);
}

/**
 * API Route handler for DELETE requests.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handleDeleteRequest(req);
}
