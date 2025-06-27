"use client";

import "../app/globals.css";
import NotFoundCard from "@components/MagicCard/NotFoundCard";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function Custom404() {
  return (
    <>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <NotFoundCard />
        </NextThemesProvider>
      </NextUIProvider>
    </>
  );
}
