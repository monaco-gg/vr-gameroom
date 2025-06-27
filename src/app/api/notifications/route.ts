import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@helpers/dbConnect';
import Notification from '@models/Notification';
import User from '@models/User';
import { getServerSession } from 'next-auth/next';

async function getUserByEmail(email: string) {
  await dbConnect();
  return User.findOne({ email });
}

async function createNotification({ title, message, type, status, userId }: any) {
  return Notification.create({ title, message, type, status, userId });
}

async function handlePostRequest(req: NextRequest) {
  try {
    const { title, message, type, status, email } = await req.json();
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const notification = await createNotification({ title, message, type, status, userId: existingUser._id });

    return NextResponse.json({
      success: true,
      message: "Notification registered successfully",
      data: notification,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}

async function handlePatchRequest(req: NextRequest) {
  try {
    const { notificationIds } = await req.json();

    await dbConnect();

    const result = await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { readAt: Date.now(), status: "read" } },
      { multi: true, new: true }
    );

    if (!result.modifiedCount) {
      return NextResponse.json({ message: "Notifications not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Notifications updated successfully",
      data: result,
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}

async function handleGetRequest(req: NextRequest, email: string) {
  try {
    const { searchParams } = new URL(req.url);
    const emailFromQuery = searchParams.get('email');

    if (emailFromQuery !== email) {
      return NextResponse.json({ message: "Access denied. You can only view your own notifications." }, { status: 403 });
    }

    await dbConnect();
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const notifications = await Notification.find({ userId: existingUser._id });

    if (!notifications.length) {
      return NextResponse.json({ message: "Notifications not found" }, { status: 404 });
    }

    return NextResponse.json({ data: notifications }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }
  return handlePostRequest(req);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  return handlePatchRequest(req);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  const email = session.user?.email;
  if (email) {
    return handleGetRequest(req, email);
  } else {
    return NextResponse.json({ message: 'Email not found in session' }, { status: 401 });
  }
}
