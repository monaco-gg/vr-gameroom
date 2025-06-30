import { Button, Link } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/legacy/image";
import { GoogleIcon } from "@components/Icons/GoogleIcon";
import { useFirebaseAnalytics } from "@utils/firebase";
import PWAInstallButton from "@components/PWAInstallButton";
import { AppConfig } from '@utils/loaderConfig';

export default function SignIn({ referralCode, callbackUrl }) {
  const { handleLogEvent } = useFirebaseAnalytics();
  const [firstLogin, setFirstLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: MRC customize
  const bradingLogo = AppConfig.texts.branding.logo || '/logo-text.png'; 
  const bradingTitle = AppConfig.texts.branding.title || 'Game Room'; 
  const headerLogo = AppConfig.texts.header.logo || '/monaco.png'; 
  const headerTitle = AppConfig.texts.header.title || 'Game Room'; 
  const effetctClearScreenColor = AppConfig.styles.components.effect.clearScreen.color || "#1B133F"; 

  useEffect(() => {
    const userAlreadyLogged = localStorage.getItem("userLogged");
    if (userAlreadyLogged) {
      setFirstLogin(false);
    } else {
      localStorage.setItem("userLogged", "true");
    }
  }, []);

  useEffect(() => {
    if (referralCode) {
      document.cookie = `referralCode=${referralCode}; path=/; expires=${new Date(
        "9999-12-31"
      ).toUTCString()}`;
    }
  }, [referralCode]);

  useEffect(() => {

    if (window) {
      const canvas = document.querySelector("#galaxy");
      const stars = [];
      const totalStars = 100;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      /**
       * Resizes the canvas to the window dimensions.
       */
      const resizeCanvas = () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
      };

      resizeCanvas();
      window.onresize = resizeCanvas;

      /**
       * Clears the canvas screen.
       */
      const clearScreen = () => {
        //TODO: MRC customize 
        ctx.fillStyle = effetctClearScreenColor; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      // Initialize stars with random positions and speeds
      for (let i = 0; i < totalStars; i++) {
        stars.push({
          x: Math.floor(Math.random() * canvas.width),
          y: Math.floor(Math.random() * canvas.height),
          speed: Math.random() * 0.5,
          color: Math.floor(Math.random() * 3),
        });
      }

      /**
       * Main animation loop.
       */
      const loop = () => {
        requestAnimationFrame(loop);
        update();
        render();
      };

      /**
       * Updates the positions of the stars.
       */
      const update = () => {
        for (let i = 0; i < totalStars; i++) {
          stars[i].x -= stars[i].speed;
          if (stars[i].x < 0) stars[i].x = canvas.width;
        }
      };

      /**
       * Renders the stars on the canvas.
       */
      const render = () => {
        clearScreen();
        for (let i = 0; i < totalStars; i++) {
          const s = stars[i];
          ctx.lineWidth = 1;
          ctx.strokeStyle = ["#444", "#888", "#FFF"][s.color];
          ctx.strokeRect(s.x, s.y, 1, 1);
        }
      };

      loop();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Entre na competição - {headerTitle}</title>
        <meta
          name="description"
          content="Participe da competição de jogos clássicos e concorra a prêmios!"
          key="desc"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href={headerLogo} />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>

      <div className="flex flex-col min-h-screen justify-between">
        <main className="flex flex-col items-center justify-center flex-grow animate-gradient bg-gradient-radial from-[#0a011849] via-[#6e4aff2f] to-transparent">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <Link href="/" rel="noopener noreferrer">
              <Image
                src={bradingLogo}
                width={48}
                height={48}
                className="mx-auto"
                alt={bradingTitle}
              />
            </Link>
            {referralCode ? (
              <div className="text-center mb-8">
                <h2 className="font-archivo mt-6 text-center text-3xl font-semibold leading-9 text-white mb-1">
                  Você foi desafiado!
                </h2>
                <span className="text-center text-md text-neutral-400 text-balance">
                  Entre, jogue e acumule pontos para se destacar no ranking e
                  vencer seus amigos.
                </span>
              </div>
            ) : (
              <div className="text-center mb-8">
                <h2 className="font-archivo mt-6 text-center text-3xl font-semibold leading-9 text-white mb-1">
                  {firstLogin ? "Entre com sua conta!" : "Bem-vindo de volta!"}
                </h2>
                <p className="text-center text-md text-neutral-400 px-10 text-balance">
                  {firstLogin ? (
                    <>
                      Clique no botão abaixo para{" "}
                      <b className="text-cyan-300">
                        entrar ou criar uma nova conta
                      </b>{" "}
                      com o Google.
                    </>
                  ) : (
                    <>
                      Continue sua jornada e acumule pontos para subir no
                      ranking!
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
          <Button
            startContent={isLoading ? null : <GoogleIcon />}
            isLoading={isLoading}
            disabled={isLoading}
            onPress={() => {
              setIsLoading(true);
              handleLogEvent("google_sign_in_click");
              signIn("google", {
                callbackUrl: callbackUrl
                  ? callbackUrl
                  : `${process.env.NEXT_PUBLIC_API_URL}/room/catalog`,
              });
            }}
            className="font-inter bg-white text-black flex mb-4 px-16 rounded-full h-14"
          >
            {isLoading ? "Carregando..." : "Entre com Google"}
          </Button>

          <div className="text-center w-full">
            <PWAInstallButton />
          </div>
        </main>
        <div className="z-[-1] fixed top-0 left-0 opacity-50">
          <canvas id="galaxy"></canvas>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { referralCode, callbackUrl } = context.query;

  return {
    props: {
      referralCode: referralCode || null,
      callbackUrl: callbackUrl || null,
    },
  };
}
