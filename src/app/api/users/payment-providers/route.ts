import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import User from "@models/User";
import { generateCustomer as generateAsaasCustomer } from "@helpers/asaasService";
import { getServerSession } from "next-auth/next";

/**
 * Handles the POST request to create or update a user as a customer in the specified payment provider.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object indicating the result of the operation.
 */
async function handlePostRequest(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, cpfCnpj, provider } = await req.json();

    // Validate required fields
    if (!userId || !cpfCnpj || !provider) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID, CPF/CNPJ, and provider are required",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.paymentProviders?.[provider]) {
      return NextResponse.json(
        {
          success: true,
          message: `User is already a registered customer with ${provider}`,
          data: user,
        },
        { status: 200 }
      );
    }

    let customerResponse;
    if (provider === "asaas") {
      customerResponse = await generateAsaasCustomer({
        name: user.name,
        cpfCnpj,
        email: user.email || null,
        mobilePhone: user.phone || null,
      });
      user.paymentProviders[provider] = customerResponse.id;
    }

    user.cpfCnpj = cpfCnpj;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: `User updated with ${provider} Customer ID`,
        data: user,
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
 * Endpoint handler for POST requests.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} The response object indicating the result of the operation.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handlePostRequest(req);
}
