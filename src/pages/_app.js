/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../app/globals.css";
import { GlobalProvider } from "@contexts/GlobalContext";
import useDevtoolsDetector from "@hooks/useDevToolsDetector";
import { useEffect } from "react";
import {
  handleLogEventWithoutSession,
  onMessageListener,
} from "@utils/firebase";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const isDevtoolsOpen = useDevtoolsDetector();
  if (isDevtoolsOpen) {
    return (
      <div
        style={{ backgroundColor: "white", width: "100vw", height: "100vh" }}
      ></div>
    );
  }

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          handleLogEventWithoutSession("push_notification_registred");
          console.log("Registration successful, scope is:", registration.scope);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      onMessageListener()
        .then((payload) => {
          console.log("Message received. ", payload);
          handleLogEventWithoutSession("push_notification_received");
          // Handle the received message here
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <NextNProgress
          color={"#6d4aff"}
          height={4}
          options={{ easing: "ease", showSpinner: false }}
        />
        <ToastContainer theme="dark" position="top-center" />
        <GlobalProvider>
          <NextUIProvider disableAnimation={false} disableRipple={false}>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              <Component {...pageProps} />
            </NextThemesProvider>
          </NextUIProvider>
        </GlobalProvider>
      </SessionProvider>
    </>
  );
}
