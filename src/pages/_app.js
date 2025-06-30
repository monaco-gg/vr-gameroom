
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@contexts/GlobalContext";
import useDevtoolsDetector from "@hooks/useDevToolsDetector";
import NextNProgress from "nextjs-progressbar";
import Script from "next/script";
import "react-toastify/dist/ReactToastify.css";
import "../app/globals.css";


import {
  handleLogEventWithoutSession,
  onMessageListener,
} from "@utils/firebase";




//TODO: MRC customize
//import Toggle from '@components/Theme/Toggle';
// ✅ Controlador de modais baseado em query string
// import { AdModalsController } from "@components/Ads/AdModalsController";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const isDevtoolsOpen = useDevtoolsDetector();

  if (isDevtoolsOpen) {
    return (
      <div style={{ backgroundColor: "white", width: "100vw", height: "100vh" }} />
    );
  }

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          handleLogEventWithoutSession("push_notification_registred");
          console.log("✅ Service Worker registrado:", registration.scope);
        })
        .catch((err) => {
          console.error("❌ Service Worker erro:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      onMessageListener()
        .then((payload) => {
          console.log("📩 Notificação recebida:", payload);
          handleLogEventWithoutSession("push_notification_received");
        })
        .catch((err) => console.log("❌ Erro notificação:", err));
    }
  }, []);

  return (
    <>
      {/* ✅ Script GPT do Google Ad Manager */}
      {/* <Script
        strategy="afterInteractive"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      /> */}

      <SessionProvider session={session}>
        <NextNProgress
          color="#6d4aff"
          height={4}
          options={{ easing: "ease", showSpinner: false }}
        />
        <ToastContainer theme="dark" position="top-center" />
        <GlobalProvider>
          <NextUIProvider disableAnimation={false} disableRipple={false}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {/* Página principal */}
               {/* TODO: MRC customize - Disabled 
              <div className="flex justify-end p-4">
                <Toggle />
              </div> */}
              <Component {...pageProps} />

              {/* ✅ Modais automáticos com base em query string */}
              {/* <AdModalsController /> */}
            </NextThemesProvider>
          </NextUIProvider>
        </GlobalProvider>
      </SessionProvider>
    </>
  );
}
