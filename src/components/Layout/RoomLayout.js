"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Head from "next/head";
import { inDevEnvironment } from "@utils/index";
import FooterRoom from "../FooterRoom";
import HeaderRoom from "../HeaderRoom";
import { useEffect } from "react";
import GoogleAdsense from "@components/Ads/GoogleAdsense";
import { AppConfig } from '@utils/loaderConfig';

/**
 * Layout component for the room.
 *
 * @param {object} props - The component props.
 * @param {object} props.session - The user session.
 * @param {string} props.title - The page title.
 * @param {boolean} [props.widthHeader=true] - Flag to include header.
 * @param {boolean} [props.withFooter=true] - Flag to include footer.
 * @param {boolean} [props.isBack=false] - Flag for back navigation.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The room layout.
 */
const RoomLayout = ({
  session = undefined,
  title,
  widthHeader = true,
  withFooter = true,
  isBack = false,
  children,

}) => {

  // const brandingLogo = AppConfig.texts.branding.logo || "/logo-text.png";
  // const brandingTitle = AppConfig.texts.branding.title || "Game Room";
  // const headerLogo = AppConfig.texts.header.logo || "/monaco.png";
  // const headerTitle = AppConfig.texts.header.title || "Game Room";
  const effetctClearScreenColor = AppConfig.styles.components.effect.clearScreen.color || "#1B133F"; 

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
  }, [effetctClearScreenColor]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/192x192.png"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        ></meta>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      {widthHeader && <HeaderRoom session={session} isBack={isBack} />}
      <main className="flex flex-col min-h-screenpb-20 flex-grow pb-32 p-0">
        {children}
        {!inDevEnvironment && <Analytics />}
        {!inDevEnvironment && <SpeedInsights />}
      </main>
      {withFooter && <FooterRoom session={session} />}
      <div className="z-[-1] fixed top-0 left-0 opacity-40">
        <canvas id="galaxy"></canvas>
      </div>
      <GoogleAdsense pId="ca-pub-9746054923547036" />
    </>
  );
};

export default RoomLayout;
