import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import User from "@models/User";
import request from "@utils/api";
import admin from "firebase-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";

const firebaseConfig = {
  disabled: process.env.NEXT_PUBLIC_FIREBASE_DISABLED === "true",
  privateKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

// Verifica se o Firebase está desativado
if (!firebaseConfig.disabled) {
  // Verificação se a variável de ambiente está definida
  if (!firebaseConfig.privateKey) {
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
        privateKey: firebaseConfig.privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }
} else {
  console.warn(
    "Firebase notifications are disabled. Set NEXT_PUBLIC_FIREBASE_DISABLED to 'false' to enable."
  );
}

async function sendNotification(user: any) {
  const notificationData = {
    email: user.email,
    message:
      "Suas fichas foram renovadas, volte agora a jogar para conquistar o seu prêmio",
    title: "Fichas Renovadas",
    type: "renew-coins",
    status: "new",
  };

  const headers = {
    "X-API-KEY": process.env.API_KEY || "",
  };

  try {
    await request(
      "/notifications",
      "POST",
      notificationData,
      undefined,
      true,
      undefined,
      headers
    );

    if (user.enableNotifications && user.tokenDevice) {
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
    }
  } catch (error) {
    console.error(`Error sending notification to user ${user._id}:`, error);
  }
}

async function handleGetRequest() {
  await dbConnect();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const usersToRenew = await User.find({
    lastCoinsRenewal: { $lt: todayStart },
    coinsAvailable: { $lt: 3 },
  });

  if (usersToRenew.length > 0) {
    const updateResult = await User.updateMany(
      { _id: { $in: usersToRenew.map((user: { _id: any }) => user._id) } },
      { $set: { coinsAvailable: 3, lastCoinsRenewal: new Date() } }
    );

    await Promise.all(usersToRenew.map(sendNotification));

    return NextResponse.json({
      message: `Tokens/Credits successfully renewed for ${updateResult.modifiedCount} eligible users.`,
    });
  } else {
    return NextResponse.json({ message: "No users eligible for renewal." });
  }
}

async function handlePostRequest(email: string) {
  await dbConnect();

  if (!email) {
    return NextResponse.json({
      message: "Invalid e-mail to eligible for renewal.",
    });
  }

  const userToRenew = await User.findOne({
    coinsAvailable: { $lt: 3 },
    email: email,
  });

  if (userToRenew) {
    const updateResult = await User.findByIdAndUpdate(
      userToRenew._id,
      { $set: { coinsAvailable: 3, lastCoinsRenewal: new Date() } },
      { new: true }
    );

    await sendNotification(userToRenew);

    return NextResponse.json({
      message: `Tokens/Credits successfully renewed for user ${email}`,
      user: updateResult,
    });
  } else {
    return NextResponse.json({ message: "No user eligible for renewal." });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verifica a autenticação aqui, se necessário
    // const authHeader = req.headers.get('authorization');
    // if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    // }

    return await handleGetRequest();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error renewing tokens/credits:", error);
      return NextResponse.json(
        {
          error: "An error occurred during the renewal process.",
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred.",
      },
      { status: 500 }
    );
  }
}

/**
 * Main handler function for the API endpoint.
 *
 * @param {NextRequest} req - The HTTP request object.
 * @returns {Promise<NextResponse>}
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const email = session?.user?.email;

    return handlePostRequest(email);
  } catch (err) {
    console.error("A server error occurred:", err);
    return NextResponse.json(
      { message: "A server error occurred", error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(): Promise<NextResponse> {
  return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
    status: 405,
  });
}
