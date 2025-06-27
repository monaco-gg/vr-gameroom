import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Coupon from "@models/Coupon";
import User from "@models/User";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

const createErrorResponse = (message: string, status: number) => {
  return NextResponse.json({ success: false, message }, { status });
};

const createSuccessResponse = (data: any, message: string, status: number) => {
  return NextResponse.json({ success: true, message, data }, { status });
};

const validateCoupon = async (couponCode: string, userId: string) => {
  await dbConnect();
  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon || !coupon.isActive) throw new Error("Cupom inválido ou inativo");
  if (coupon.expirationDate < new Date()) throw new Error("Cupom expirado");
  if (coupon.remainingUses <= 0)
    throw new Error("Limite de uso do cupom atingido");

  const user = await User.findById(userId);
  if (!user) throw new Error("Usuário não encontrado");

  // Verificar se usedCoupons existe e é um array antes de chamar includes
  if (
    Array.isArray(user.usedCoupons) &&
    user.usedCoupons.includes(coupon.code)
  ) {
    throw new Error("Você já usou este cupom");
  }

  let discountAmount: number;
  if (coupon.discountType === "percentage") {
    discountAmount = coupon.discountValue; // Retorna a porcentagem de desconto
  } else {
    discountAmount = coupon.discountValue; // Retorna o valor fixo de desconto
  }

  return {
    isValid: true,
    discountType: coupon.discountType,
    discountValue: discountAmount,
    couponCode: coupon.code,
  };
};

// Request handlers
const handleGetRequest = async (
  req: NextRequest,
  { params }: { params: { code: string } }
) => {
  try {
    const coupon = await Coupon.findOne({ code: params.code });
    if (!coupon) return createErrorResponse("Cupom não encontrado", 404);
    return createSuccessResponse(coupon, "", 200);
  } catch (err) {
    return createErrorResponse("Ocorreu um erro inesperado", 500);
  }
};

const handlePostRequest = async (
  req: NextRequest,
  { params }: { params: { code: string } },
  session: Session
) => {
  try {
    if (!session?.user?.email) {
      return createErrorResponse("Usuário não encontrado na sessão", 401);
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return createErrorResponse("Usuário não encontrado", 404);
    }

    const validationResult = await validateCoupon(
      params.code,
      user._id.toString()
    );
    return createSuccessResponse(
      validationResult,
      "Cupom validado com sucesso",
      200
    );
  } catch (err) {
    return createErrorResponse((err as Error).message, 400);
  }
};

// Authentication middleware
const withAuth = (
  handler: (
    req: NextRequest,
    context: any,
    session: Session
  ) => Promise<NextResponse>
) => {
  return async (req: NextRequest, context: any) => {
    const session = await getServerSession();
    if (!session) return createErrorResponse("Autenticação necessária", 401);
    return handler(req, context, session);
  };
};

// Exported request handlers
export const GET = withAuth(handleGetRequest);
export const POST = withAuth(handlePostRequest);
