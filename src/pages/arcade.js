"use client";

import FullscreenBackground from "@components/FullscreenBackground";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function BGSPage() {
  const searchParams = useSearchParams();
  const frame2Ref = useRef(null);
  const mode = searchParams.get("mode") || "1";
  const main = searchParams.get("main") || "25,58,320";
  const [w, h, margin] = main.split(",").map(Number);
  const ranking = searchParams.get("ranking") || "25,60,30,100";
  const [wRanking, hRanking, rightRanking, topRanking] = ranking
    .split(",")
    .map(Number);

  let arcade = "/arcade-fit.png";

  if (mode == "2") {
    arcade = "/arcade-fit-2.png";
  }

  if (mode == "3") {
    arcade = "/arcade-fit-3.png";
  }

  useEffect(() => {
    if (frame2Ref.current) {
      frame2Ref.current.focus();
    }
  }, []);

  return (
    <FullscreenBackground imageUrl={arcade} alt="arcade">
      <main className="relative z-10 w-svh h-svh flex flex-grow overflow-hidden items-center justify-center">
        <iframe
          src="/play/4?coins=true&fullscreen=true&rotate=true"
          className={`border-none mx-auto rounded-3xl rotate`}
          style={{
            width: `${w}%`,
            height: `${h}%`,
            marginTop: `${margin}px`,
          }}
          ref={frame2Ref}
          tabIndex="0"
        />

        {mode == "1" && (
          <iframe
            src="/ranking"
            className={`border-none fixed right-5 rounded-xl opacity-80`}
            style={{
              width: `${wRanking}%`,
              height: `${hRanking}%`,
              right: `${rightRanking}px`,
              top: `${topRanking}px`,
            }}
          />
        )}
      </main>
    </FullscreenBackground>

    // <div className="flex flex-col h-screen">
    //   <Head>
    //     <title>BGS Monaco TV</title>
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>

    //   <main className="flex flex-grow overflow-hidden">
    //     <iframe src="/cover" className="w-[30%] border-none" />
    //     <iframe
    //       src="/play/4?coins=true&fullscreen=true&rotate=true"
    //       className="w-[40%] border-none"
    //       ref={frame2Ref}
    //       tabIndex="0"
    //     />
    //     <iframe src="/ranking" className="w-[30%] border-none" />
    //   </main>
    // </div>
  );
}
