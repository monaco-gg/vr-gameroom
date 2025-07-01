import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@helpers/dbConnect";
import User from "@models/User";
import request from "@utils/api";
import admin from "firebase-admin";

const firebaseConfig = {
  disabled: process.env.NEXT_PUBLIC_FIREBASE_DISABLED === "true",
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

// Verifica se o Firebase está desativado
if (!firebaseConfig.disabled) {
  // Verificação da chave privada do Firebase
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
    message: "Você ganhou 1 ficha para jogar mais uma vez. Boa sorte!",
    title: "Ficha Adicionada",
    type: "add-coin",
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
    console.error(
      `Erro ao enviar notificação para o usuário ${user._id}:`,
      error
    );
  }
}

async function handlePostRequest(email: string) {
  await dbConnect();

  if (!email) {
    return NextResponse.json({ message: "E-mail inválido." }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "Usuário não encontrado." },
      { status: 404 }
    );
  }

  // Soma +1 ficha SEM limite
  user.coinsAvailable = (user.coinsAvailable || 0) + 1;

  await user.save();

  await sendNotification(user); // opcional

  return NextResponse.json({
    message: `1 ficha adicionada para o usuário ${email}.`,
    coinsAvailable: user.coinsAvailable,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "E-mail é obrigatório" },
        { status: 400 }
      );
    }

    return await handlePostRequest(email);
  } catch (err) {
    console.error("Erro ao processar requisição de ficha:", err);
    return NextResponse.json(
      {
        message: "Erro no servidor",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export async function PATCH(): Promise<NextResponse> {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
