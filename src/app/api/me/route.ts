import dbConnect from "@helpers/dbConnect";
import User from "@models/User";
import { formatDate } from "@utils/index";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * Handles GET request to retrieve user details.
 * @param {NextRequest} req - The incoming request object.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<NextResponse>} - The response with user details or an error message.
 */
async function handleGetRequest(req: NextRequest, id: string): Promise<NextResponse> {
  try {
    await dbConnect();

    const user = await User.findById(id).lean().exec();
    if (user) {
      const isProfileCompleted = Boolean(user.dateOfBirth && user.phone && user.nickname);

      return NextResponse.json(
        {
          ...user,
          isProfileCompleted,
          dateOfBirth: formatDate(user.dateOfBirth),
          phone: user.phone,
          nickname: user.nickname,
          coinsAvailable: user.coinsAvailable,
          lastCoinsRenewal: user.lastCoinsRenewal,
          referralCode: user.referralCode,
          enableNotifications: user.enableNotifications,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET handler for retrieving user data based on session.
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<NextResponse>} - The response with user data or an error message.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const userId = session.user?.id;

  if (userId) {
    return handleGetRequest(req, userId);
  } else {
    return NextResponse.json(
      { message: "User not found in session" },
      { status: 401 }
    );
  }
}
