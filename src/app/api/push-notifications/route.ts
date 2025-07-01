import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import User from "@models/User";
import admin from "firebase-admin";

// Firebase initialization
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!firebasePrivateKey) {
  throw new Error(
    "FIREBASE_PRIVATE_KEY is not defined in the environment variables"
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "gameroom-416719",
      clientEmail:
        "firebase-adminsdk-6ak35@gameroom-416719.iam.gserviceaccount.com",
      privateKey: firebasePrivateKey.replace(/\\n/g, "\n"),
    }),
  });
}

async function sendNotification(user: any, notificationData: any) {
  try {
    if (user.tokenDevice) {
      const message = {
        webpush: {
          notification: {
            title: notificationData.title,
            body: notificationData.message,
            icon: "https://games.monaco.gg/icon.png",
          },
        },
        token: user.tokenDevice,
      };
      await admin.messaging().send(message);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error sending notification to user ${user._id}:`, error);
    throw error;
  }
}

async function handlePostRequest(req: NextRequest) {
  try {
    const { email, title, message } = await req.json();
    if (!title || !message) {
      return NextResponse.json(
        { message: "Title and message are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const notificationData = { title, message };

    // If email is provided, send to specific user
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (!user.enableNotifications || !user.tokenDevice) {
        return NextResponse.json(
          {
            success: false,
            message:
              "User has not enabled notifications or doesn't have a device token",
          },
          { status: 400 }
        );
      }

      const sent = await sendNotification(user, notificationData);
      return NextResponse.json({
        success: sent,
        message: sent
          ? "Notification sent successfully"
          : "Failed to send notification",
      });
    }

    // If no email, broadcast to all eligible users
    const eligibleUsers = await User.find({
      enableNotifications: true,
      tokenDevice: { $exists: true, $ne: null },
    });

    const results = await Promise.allSettled(
      eligibleUsers.map((user: any) => sendNotification(user, notificationData))
    );

    const successCount = results.filter(
      (result) => result.status === "fulfilled" && result.value
    ).length;

    return NextResponse.json({
      success: successCount > 0,
      message: `Notification sent to ${successCount} of ${eligibleUsers.length} users`,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
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

export async function GET(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
  });
}

export async function PATCH(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
  });
}
