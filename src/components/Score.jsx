import { DB } from "@app/utils/storage";
import { Fireworks } from "@fireworks-js/react";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { getTickets } from "../app/contexts/EngineContext";

/**
 * Score component that displays the end of game screen with the number of tickets won and options to continue.
 *
 * @param {Object} props - The component props
 * @param {string} props.gameId - The ID of the current game
 * @returns {JSX.Element} The rendered score component.
 */
const Score = ({ gameId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen") || false;
  const timeRecords = DB.getData();
  const avgTime = timeRecords?.avg || false;
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  /**
   * Handles the action when the "Voltar" button is clicked.
   * Sets the loading state and navigates to the catalog page.
   */
  const handleBackClick = () => {
    setIsLoading(true);
    if (isFullscreen) {
      const id = window.location.href.match(/\/play\/(\d+)/)[1];
      const queryString = window.location.search;
      router.push(`/play/${id}${queryString}`);
    } else {
      router.push("/room/catalog");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen z-20">
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
        <div className="bg-black rounded-2xl shadow-lg w-full m-10 z-10">
          <div className="justify-center items-center border-b border-neutral-800 p-4">
            <h3 className="text-2xl text-center font-extrabold text-[#6D49FF]">
              FIM DE JOGO
            </h3>
            {avgTime && (
              <div className="mt-3 mb-10">
                <b className="text-white text-2xl block text-center">
                  MÉDIA DE TEMPO
                </b>
                <b className="text-yellow-300 text-4xl block text-center mt">
                  <CountUp end={avgTime} delay={1} duration={3} />
                  ms
                </b>
              </div>
            )}
            {!isFullscreen && (
              <p className="text-white text-2xl text-center">
                Fim de jogo, você ganhou <br />
                <b className="text-yellow-300">
                  <CountUp
                    end={getTickets()}
                    delay={1}
                    duration={4}
                  />{" "}
                  tickets!
                </b>{" "}
              </p>
            )}
            {isFullscreen && (
              <p className="text-white text-2xl text-center">
                Agora acesse o Game Room no seu smartphone e continue se
                divertindo
              </p>
            )}
          </div>
          <div className="border-t border-neutral-800 p-4 text-right">
            {!isFullscreen && (
              <p className="text-white text-center mx-4 pb-4">
                Continue jogando para ganhar prêmios.
              </p>
            )}
            <Button
              isLoading={isLoading}
              onClick={handleBackClick}
              onPress={handleBackClick}
              ref={buttonRef}
              disabled={isLoading}
              className="bg-[#6D49FF] text-white px-4 py-2 w-full rounded-2xl"
            >
              {isLoading
                ? "CARREGANDO..."
                : isFullscreen
                ? "JOGAR NOVAMENTE"
                : "VOLTAR"}
            </Button>
          </div>
        </div>
        <div className="z-0">
          <Fireworks
            options={{ opacity: 0.5 }}
            style={{
              color: "#6D49FF",
              top: 0,
              left: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Score;
