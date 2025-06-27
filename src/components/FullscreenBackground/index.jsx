"use client";

import React from "react";
import Image from "next/image";

const FullscreenBackground = ({ imageUrl, alt, children }) => {
  return (
    <div className="relative min-h-screen w-full">
      <Image
        src={imageUrl}
        alt={alt || "Fullscreen background"}
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default FullscreenBackground;
