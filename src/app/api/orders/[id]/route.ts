import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@helpers/dbConnect";
import Order from "@models/Order";
import { NextApiRequest } from "next";

async function getOrderById(id: string) {
  await dbConnect();
  return Order.findById(id).populate("user").populate("items.product");
}

async function updateOrder(id: string, updateData: any) {
  await dbConnect();
  return Order.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteOrder(id: string) {
  await dbConnect();
  return Order.findByIdAndDelete(id);
}

async function handlePutRequest(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();
    const order = await updateOrder(id, updateData);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        data: order,
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

async function handleGetRequest(id: string) {
  try {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

async function handleDeleteRequest(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }
    const order = await deleteOrder(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Order deleted successfully",
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

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handlePutRequest(req);
}

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

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handleDeleteRequest(req);
}
