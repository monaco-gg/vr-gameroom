import { useState } from "react";
import { GAME_STATE } from "../app/contexts/EngineContext";
import { DB } from "../app/utils/storage";
import { Button } from "@nextui-org/react";

/**
 * Menu component that provides options to continue the game, toggle audio, and exit the game.
 *
 * @param {object} props - Properties passed to the component.
 * @param {object} props.engine - The game engine instance used for managing game state and audio.
 * @returns {JSX.Element} The rendered menu component.
 */
const Menu = ({ engine }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [textButton, setTextButton] = useState(
    DB.isMuted() ? "ATIVAR" : "DESATIVAR"
  );

  /**
   * Closes the menu and resumes the game based on the current game state.
   */
  const closeMenu = () => {
    const currentState = DB.getState();

    if (currentState === GAME_STATE.PAUSED) {
      if (engine.get("player")[0]) {
        DB.setState(GAME_STATE.RUNNING);
      } else {
        DB.setState(GAME_STATE.WAITING);
      }
    }
  };

  /**
   * Toggles the game's audio between muted and unmuted states.
   */
  const toggleAudio = () => {
    const isMuted = DB.isMuted();

    setTextButton((prevText) =>
      prevText === "ATIVAR" ? "DESATIVAR" : "ATIVAR"
    );

    if (isMuted) {
      engine.volume(1);
      return DB.unMute();
    }

    engine.volume(0);
    return DB.mute();
  };

  return (
    <div className="flex items-center justify-center h-screen z-20">
      <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-10">
        <div className="bg-black rounded-2xl shadow-lg w-full m-10 z-10">
          <div className="flex justify-between items-center border-b border-neutral-800 p-4">
            <h3 className="text-lg font-semibold">MENU</h3>
            <button
              onClick={closeMenu}
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={closeMenu}
                  className="bg-green-500 text-white px-4 py-2 w-full rounded"
                >
                  CONTINUAR
                </button>
              </li>
              <li>
                <button
                  onClick={toggleAudio}
                  className="bg-gray-500 text-white px-4 py-2 w-full rounded"
                >
                  {textButton} ÁUDIO
                </button>
              </li>
            </ul>
          </div>
          <div className="border-t border-neutral-800 p-4 text-right">
            <Button
              isLoading={isLoading}
              onClick={() => {
                setIsLoading(true);
                window.location.href = "/room/catalog";
              }}
              onPress={() => {
                setIsLoading(true);
                window.location.href = "/room/catalog";
              }}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 w-full rounded"
            >
              {isLoading ? "Aguarde..." : "SAIR DO JOGO"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
