import React from "react";
import { useQRCode } from "next-qrcode";
import Image from "next/legacy/image";
import BackgroundEffect from "@components/BackgroundEffect";
import { useRouter } from "next/router";

export default function SignInQrCode() {
  const { Canvas } = useQRCode();
  const router = useRouter();

  const referralCode = router.query.referralCode;
  const callbackUrl = router.query.callbackUrl;

  let qrText = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in?callbackUrl=${
    callbackUrl || ""
  }`;
  if (referralCode && referralCode.trim() !== "") {
    qrText += `&referralCode=${referralCode}`;
  }

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src="/monaco.png"
            width={132}
            height={132}
            className="mx-auto"
            alt="Super Monaco"
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white mb-8">
            Entre com seu dispositivo móvel
          </h2>
        </div>
        <Canvas
          text={qrText}
          options={{
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 200,
          }}
        />
      </main>
      <BackgroundEffect />
    </div>
  );
}
