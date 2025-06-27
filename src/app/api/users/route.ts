import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import Notification from "@models/Notification";
import Ticket from "@models/Ticket";
import User from "@models/User";
import { getServerSession } from "next-auth/next";
import {
  formatDate,
  formatDatetoISO,
  generateReferralCode,
} from "@utils/index";

async function handlePostRequest(req: NextRequest) {
  try {
    const { email, photo, name } = await req.json();

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const newUserDetails = {
        email,
        photo,
        name,
        referralCode: generateReferralCode(email),
      };

      const user = await User.create(newUserDetails);
      await Ticket.create({ user: user._id, amount: 0 });

      return NextResponse.json(
        {
          success: true,
          message: "registered successfully",
          isProfileCompleted: false,
          data: user,
        },
        { status: 201 }
      );
    } else {
      const isProfileCompleted = !!(
        existingUser.dateOfBirth &&
        existingUser.phone &&
        existingUser.nickname
      );
      return NextResponse.json(
        {
          success: true,
          message: ":)",
          isProfileCompleted,
          data: existingUser
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handlePatchRequest(req: NextRequest, email: string) {
  try {
    const {
      email: emailFromBody,
      dateOfBirth,
      phone,
      nickname,
      referralCode,
    } = await req.json();

    if (emailFromBody !== email) {
      return NextResponse.json(
        { message: "Access denied. You can only edit your own profile." },
        { status: 403 }
      );
    }

    await dbConnect();

    const updatedUser = await User.findOne({ email });
    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userReferral = referralCode
      ? await User.findOne({ referralCode })
      : null;

    if (userReferral && !updatedUser.referredBy) {
      updatedUser.referredBy = userReferral._id;
      await User.findByIdAndUpdate(userReferral._id, {
        $inc: { coinsAvailable: 3 },
      });

      await Notification.create({
        title: "Indicação concluída",
        message:
          "Seu convidado concluiu o cadastro e está pronto pra competir com você",
        type: "referral-completed",
        status: "new",
        userId: updatedUser.referredBy,
      });
    }

    updatedUser.dateOfBirth = dateOfBirth
      ? formatDatetoISO(dateOfBirth)
      : updatedUser.dateOfBirth;
    updatedUser.phone = phone || updatedUser.phone;
    updatedUser.nickname = nickname || updatedUser.nickname;

    await updatedUser.save();

    const isProfileCompleted = !!(
      updatedUser.dateOfBirth &&
      updatedUser.phone &&
      updatedUser.nickname
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile successfully updated",
        data: updatedUser,
        isProfileCompleted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database or server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleGetRequest(req: NextRequest, email: string) {
  try {
    const { searchParams } = new URL(req.url);
    const emailFromQuery = searchParams.get("email");

    if (emailFromQuery !== email) {
      return NextResponse.json(
        { message: "Access denied. You can only view your own profile." },
        { status: 403 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (user) {
      const isProfileCompleted = !!(
        user.dateOfBirth &&
        user.phone &&
        user.nickname
      );
      return NextResponse.json(
        {
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

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }
  return handlePostRequest(req);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const email = session.user?.email;
  if (email) {
    return handlePatchRequest(req, email);
  } else {
    return NextResponse.json(
      { message: "Email not found in session" },
      { status: 401 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 }
    );
  }

  const email = session.user?.email;
  if (email) {
    return handleGetRequest(req, email);
  } else {
    return NextResponse.json(
      { message: "Email not found in session" },
      { status: 401 }
    );
  }
}
