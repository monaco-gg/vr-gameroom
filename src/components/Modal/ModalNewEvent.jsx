import Countdown from "@components/CountDown";
import { Button } from "@nextui-org/react";
import Image from "next/legacy/image";
import React, { useEffect, useRef } from "react";

const ModalNewEvent = ({ isOpen, onClose, targetDate }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed h-full inset-0 items-center justify-center z-[60] overflow-auto">
        <div className="w-screen">
          <Image
            src="/videos/event5.gif"
            width={100}
            height={64}
            layout="responsive"
            alt="A woman playing mobile games"
          />
          {/* <video
            className="z-[-1]"
            autoPlay
            loop
            muted
            preload="auto"
            playsinline
            ref={videoRef}
          >
            <source src={"/videos/event3.mp4"} type="video/mp4" />
          </video> */}
        </div>
        <div className="text-white p-6">
          <h1 className="text-4xl font-bold mb-4 glow">
            Um novo evento iniciou!
          </h1>
          <p>É hora de mostrar seu potencial!</p>
        </div>
        <div className="m-4 -mt-2">
          <Countdown targetDate={targetDate} hideText={true} isOngoing={true} />
        </div>
        <div className="mx-6 mt-4">
          <ul className="space-y-4">
            <li>✨ O Ranking geral foi reiniciado para o evento.</li>
            <li>
              🟡 Todo dia você ganha fichas para jogar, se não tiver fichas.
            </li>
            <li>
              💰 Seus tickets acumulados serão mantidos para usar no futuro em
              compras e benefícios.
            </li>
            <li>
              💰 Prêmios de 500, 300 e 150 reais para o top 3. Compartilhe e
              aumente suas chances de ganhar.
            </li>
          </ul>
        </div>

        <div className="w-screen p-4 mt-4">
          <Button
            type="submit"
            color="secondary"
            size="lg"
            fullWidth
            onClick={onClose}
            onPress={onClose}
          >
            COMPETIR
          </Button>
        </div>
      </div>
      <div className="fixed h-full inset-0 items-center justify-center bg-[#271C57] z-[51] opacity-95 animate-gradient bg-gradient-radial from-[#0a011849] via-[#6e4aff77] to-[#0a011864]" />
      <div className="z-[52]"></div>
    </>
  );
};

export default ModalNewEvent;
