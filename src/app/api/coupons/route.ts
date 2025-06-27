import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Coupon from "@models/Coupon";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

// Utility functions
const createErrorResponse = (message: string, status: number) => {
  return NextResponse.json({ success: false, message }, { status });
};

const createSuccessResponse = (data: any, message: string, status: number) => {
  return NextResponse.json({ success: true, message, data }, { status });
};

// CRUD operations
const createCoupon = async (couponData: any) => {
  await dbConnect();
  return Coupon.create(couponData);
};

const getCoupons = async () => {
  await dbConnect();
  return Coupon.find({});
};

// Request handlers
const handlePostRequest = async (req: NextRequest) => {
  try {
    const couponData = await req.json();
    const coupon = await createCoupon(couponData);
    return createSuccessResponse(coupon, "Cupom criado com sucesso", 201);
  } catch (err) {
    return createErrorResponse("Ocorreu um erro inesperado", 500);
  }
};

const handleGetRequest = async () => {
  try {
    const coupons = await getCoupons();
    return createSuccessResponse(coupons, "", 200);
  } catch (err) {
    return createErrorResponse("Ocorreu um erro inesperado", 500);
  }
};

// Authentication middleware
const withAuth = (
  handler: (req: NextRequest, session: Session) => Promise<NextResponse>
) => {
  return async (req: NextRequest) => {
    const session = await getServerSession();
    if (!session) return createErrorResponse("Autenticação necessária", 401);
    return handler(req, session);
  };
};

// Exported request handlers
export const POST = handlePostRequest;
export const GET = withAuth(handleGetRequest);
