import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Order from "@models/Order";

const createErrorResponse = (message: string, status: number) => {
  return NextResponse.json({ success: false, message }, { status });
};

const createSuccessResponse = (data: any, message: string, status: number) => {
  return NextResponse.json({ success: true, message, data }, { status });
};

const handleExpireOrders = async () => {
  try {
    await dbConnect();

    // Calculate the start and end of the previous day
    const now = new Date();
    const endOfYesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1,
      23,
      59,
      59,
      999
    );

    const expiredOrders = await Order.updateMany(
      {
        createdAt: { $lte: endOfYesterday },
        status: "pending",
        paymentStatus: "pending",
      },
      {
        $set: { status: "cancelled", paymentStatus: "failed" },
      }
    );

    return createSuccessResponse(
      { expiredOrdersCount: expiredOrders.modifiedCount },
      `Successfully expired ${expiredOrders.modifiedCount
      } orders before to ${endOfYesterday.toISOString()}`,
      200
    );
  } catch (err) {
    throw new Error("An error occurred while expiring orders");
  }
};

const handleGetRequest = async (req: NextRequest) => {
  try {
    const result = await handleExpireOrders();
    return result;
  } catch (err) {
    return createErrorResponse("An unexpected error occurred", 500);
  }
};

const withAuth = (handler: (req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createErrorResponse("Authentication required", 401);
    }

    const token = authHeader.split(" ")[1];
    if (token !== process.env.CRON_SECRET) {
      return createErrorResponse("Invalid authentication token", 401);
    }
    return handler(req);
  };
};

// Exported request handlers
export const GET = withAuth(handleGetRequest);
