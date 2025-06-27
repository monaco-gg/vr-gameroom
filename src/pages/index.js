import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from "next/legacy/image";
import CountDown from "@components/CountDown";
import GetStarted from "@components/GetStartedButton";
import Footer from "@components/Footer";
import { inDevEnvironment } from "@utils/index";
import Link from "next/link";
import { useFirebaseAnalytics } from "@utils/firebase";
import request from "@utils/api";
import { useEffect, useState } from "react";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "../components/lottie/space.json";
import dynamic from "next/dynamic";
import { Button } from "@nextui-org/react";
import RewardsList from "@components/RewardsList";

export default function Index({ isOngoing, targetDate }) {
  const { handleLogEvent } = useFirebaseAnalytics();
  const [animation, setAnimation] = useState();

  useEffect(() => {
    if (!animation) {
      const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };

      setAnimation(
        <Lottie
          {...defaultOptions}
          style={{
            rotate: "-45deg",
            overflow: "hidden",
          }}
        />
      );
    }
  }, [animation]);

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
        ctx.fillStyle = "#1B133F";
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
        <title>Entre na competição - Monaco</title>
        <meta
          name="description"
          content="Participe da competição de jogos clássicos e concorra a prêmios!"
          key="desc"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/monaco.png" />

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
      <div className="lg:flex lg:flex-col min-h-screen">
        <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-6 lg:flex lg:flex-grow  lg:justify-end lg:items-end">
          <div className="relative  lg:h-[600] justify-center lg:ml-10">
            <div>
              <div className="  items-center">
                <Image src="/logo-text.png" width={48} height={48} alt="Logo" />
                <p className="inline-block align-middle  font-archivo font-semibold text-inherit ml-6 -mt-10 text-center text-3xl">
                  Game Room
                </p>
              </div>
              <p className="mt-6 text-lg leading-8 text-white px-2">
                Participe grátis da competição de games clássicos e concorra a
                prêmios em dinheiro!
              </p>
              <div className="mt-4 flex items-center gap-x-6 relative z-50">
                <Button
                  as={Link}
                  color="success"
                  href="/auth/sign-in"
                  onPress={() => handleLogEvent("go_to_sign_in_click")}
                  onClick={() => handleLogEvent("go_to_sign_in_click")}
                  className="rounded-full  px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  Entrar na Competição
                </Button>
              </div>
            </div>
            <div className="relative mt-10 mb-20 lg:-mb-2 flex justify-center">
              <Image
                src="/imgs/mockups.png"
                alt="App Screenshot 1"
                width={578}
                height={560}
              />
              <div className="absolute bottom-0 overflow-hidden w-full">
                {animation}
              </div>
            </div>
          </div>
          <div className="lg:max-w-xl pb-10 lg:pl-10">
            <div className="py-8 px-4 animate-gradient bg-gradient-radial from-[#0a011849] via-[#6e4aff77] to-[#0a011864] rounded-3xl border-[#6d4aff] border-4">
              <CountDown targetDate={targetDate} isOngoing={isOngoing} />
              {/* <RewardsList hideText={false} isHome={true} /> */}
              <div className="mt-10">
                <GetStarted text="Começar a jogar grátis" />
              </div>
            </div>
          </div>
        </div>
        <div className="pb-0">
          <Footer />
          <div className="z-[-1] fixed top-0 left-0 opacity-50">
            <canvas id="galaxy"></canvas>
          </div>
        </div>
      </div>

      {!inDevEnvironment && <Analytics />}
      {!inDevEnvironment && <SpeedInsights />}
    </>
  );
}

export async function getServerSideProps() {
  let isOngoing = false;
  let targetDate = null;

  try {
    const eventResponse = await request("/games/events", "GET");
    const eventData = eventResponse.data;

    if (eventData) {
      const now = new Date();
      const startDate = new Date(eventData.startDate);
      const endDate = new Date(eventData.endDate);

      if (now >= startDate && now <= endDate) {
        isOngoing = true;
        targetDate = endDate.toISOString();
      } else if (now < startDate) {
        isOngoing = false;
        targetDate = startDate.toISOString();
      } else {
        targetDate = null; // Não há eventos atuais ou futuros
      }
    } else {
      targetDate = null; // Não há eventos atuais ou futuros
    }
  } catch (error) {
    console.error("Error fetching event data:", error);
    targetDate = null; // Em caso de erro, definir como null
  }

  return {
    props: {
      isOngoing,
      targetDate,
    },
  };
}
