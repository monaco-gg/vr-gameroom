"use client";

import kaboom, { KaboomCtx } from "kaboom";
import { useSearchParams } from "next/navigation";
import React, { createContext, useEffect, useRef, useState } from "react";
import Blocked from "../../components/Blocked";
import Joystick from "../../components/Joystick/Joystick";
import Menu from "../../components/Menu";
import Score from "../../components/Score";
import { DB } from "../utils/storage";

// Configuration object for the Kaboom game canvas
const CANVA_CONFIG = {
  // Background color commented out, default is black
  background: [0, 0, 0],
  // Setting global to false if needed
  maxFPS: 60,
  global: true,
  scale: 1, // Scale factor for the canvas,
  loadingScreen: true,
};

/**
 * Context for providing Kaboom engine instances.
 * @type {React.Context<KaboomCtx | undefined>}
 */
const EngineContext = createContext();

/**
 * Enum for game state values.
 * @readonly
 * @enum {number}
 */
export const GAME_STATE = {
  LOADING: 0,
  WAITING: 1,
  RUNNING: 2,
  PAUSED: 3,
  OVER: 4,
  BLOCKED: 5,
  WIN: 6,
};

/**
 * Enum for game difficulty levels.
 * @readonly
 * @enum {number}
 */
export const GAME_LEVEL = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
  EXTREME: 3,
};

/**
 * Default game configuration values.
 * @readonly
 * @enum {number}
 */
export const GAME_DEFAULT = {
  LIFES: 3,
};

/**
 * Default game orientation values.
 * @readonly
 * @enum {string}
 */
export const GAME_ORIENTATION = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
};

/**
 * Initialize game settings in storage
 */
const settingsInitialize = () => {
  DB.setLifes(GAME_DEFAULT.LIFES);
  DB.setLevel(GAME_LEVEL.EASY);
  DB.setState(GAME_STATE.LOADING);
  DB.setData({});
};

/**
 * Calculate Tickets with optional double points
 * @param {boolean} allowDoublePoints - Flag to enable/disable double points for specific games
 * @returns {number} The number of tickets calculated
 */
export const getTickets = (allowDoublePoints = false) => {
  const currentLevel = DB.getLevel();
  let luckNumber = 0;

  if (window && window.luckNumber === undefined) {
    window.luckNumber = Math.floor(Math.random() * 10);
  }

  if (window.luckNumber !== undefined) {
    luckNumber = window.luckNumber;
  }

  if (luckNumber > 10) {
    luckNumber = 0;
  }

  // Base tickets for each level
  let baseTickets = 0;
  switch (currentLevel) {
    case GAME_LEVEL.EASY:
      baseTickets = 14 + luckNumber;
      break;
    case GAME_LEVEL.MEDIUM:
      baseTickets = 44 + luckNumber;
      break;
    case GAME_LEVEL.HARD:
      baseTickets = 54 + luckNumber;
      if (allowDoublePoints) {
        baseTickets *= 2;
      }
      break;
    case GAME_LEVEL.EXTREME:
      baseTickets = 100;
      if (allowDoublePoints) {
        baseTickets *= 2;
      }
      break;
    default:
      baseTickets = 0;
  }

  return baseTickets;
}

/**
 * Return the engine instance
 * @returns {KaboomCtx} The Kaboom engine instance.
 */
export const getEngine = () => {
  if (window === undefined) {
    return null;
  }

  if (typeof window !== "undefined" && window.engineInstanceMnc !== undefined) {
    return window.engineInstanceMnc;
  }

  window.engineInstanceMnc = kaboom({
    ...CANVA_CONFIG,
    canvas: document.querySelector("#game"),
  });

  return window.engineInstanceMnc;
};

/**
 * Provides a Kaboom engine instance to its children. Initializes a new Kaboom game engine instance
 * when the window loads and ensures clean-up by removing the event listener when the component unmounts.
 *
 * @param {Object} props - The props passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the provider.
 * @param {function} props.game - The game initialization function that accepts the Kaboom instance.
 * @param {string} props.orientation - The required game orientation ("portrait" or "landscape").
 * @param {function} props.onGameStart - Callback function executed when the game starts.
 * @param {function} props.onGameUpdate - Callback function executed to handle game updates.
 * @param {function} props.onGameOver - Callback function executed when the game ends.
 * @returns {React.ReactElement} The EngineProvider component with the engine context.
 */
export const EngineProvider = ({
  children,
  game,
  orientation,
  gameId,
  rotate = false,
  onPressA,
  onPressLeft,
  onPressRight,
  onPressUp,
  onPressDown,
  onGameStart,
  onGamePause,
  onGameUpdate,
  onGameOver,
  onClose,
  onIdle,
  debug = false,
}) => {
  const [engine, setEngine] = useState();
  const [gameState, setGameState] = useState();
  const onGameOverExecuted = useRef(false);
  const gameStateLoop = useRef(null);
  const searchParams = useSearchParams();
  const isFullscreen = searchParams.get("fullscreen") || false;

  // Resolution
  useEffect(() => {
    const handleResize = () => {
      if (rotate) {
        return;
      }

      const WINDOW_ORIENTATION =
        window.innerWidth > window.innerHeight
          ? GAME_ORIENTATION.LANDSCAPE
          : GAME_ORIENTATION.PORTRAIT;

      if (DB.getState() === GAME_STATE.BLOCKED) {
        return;
      }

      if (orientation !== WINDOW_ORIENTATION) {
        return DB.setState(GAME_STATE.BLOCKED);
      }

      return DB.setState(GAME_STATE.LOADING);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [orientation, rotate]);

  // Game loop state
  useEffect(() => {
    const handleStateChange = async () => {
      if (typeof window === "undefined") {
        return;
      }

      const instance = getEngine();
      const isPaused = instance.debug.paused;

      if (DB.getState() !== gameState) {
        setGameState(DB.getState());
      }

      // BLOCKED
      if (DB.getState() === GAME_STATE.BLOCKED) {
        instance.debug.paused = true;
        return;
      }

      // PAUSE GAME
      if (DB.getState() === GAME_STATE.PAUSED && !isPaused) {
        instance.debug.paused = true;

        if (onGamePause) {
          onGamePause();
        }

        return;
      }

      // RESUME GAME
      if (DB.getState() === GAME_STATE.RUNNING && isPaused) {
        instance.debug.paused = false;
      }

      if (typeof onGameUpdate === "function") {
        onGameUpdate();
      }

      if (
        typeof onGameOver === "function" &&
        DB.getState() === GAME_STATE.OVER &&
        !onGameOverExecuted.current
      ) {
        onGameOverExecuted.current = true;
        if (gameStateLoop.current) {
          clearInterval(gameStateLoop.current);
        }
        await onGameOver(getTickets());
      }
    };

    handleStateChange();
    gameStateLoop.current = setInterval(() => {
      handleStateChange();
    }, 500);

    return () => {
      if (gameStateLoop.current) {
        clearInterval(gameStateLoop.current);
      }
    };
  }, [
    gameState,
    gameId,
    onGameStart,
    onGamePause,
    onGameUpdate,
    onGameOver,
    onClose,
    debug,
  ]);

  useEffect(() => {
    // remove push to update
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.document.addEventListener(
        "touchmove",
        (e) => {
          if (e.scale !== 1) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    }

    // remove browser history
    window.history.pushState(null, null, window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    // check to
    window.addEventListener("beforeunload", (event) => {
      const currentState = DB.getState();

      if (currentState !== GAME_STATE.OVER && currentState !== GAME_STATE.WIN) {
        event.preventDefault();
        const confirmationMessage =
          "Se recarregar a página ou sair do jogo você perderá uma ficha, tem certeza?";
        event.preventDefault();
        event.returnValue = confirmationMessage; // Padrão para a maioria dos navegadores
        return confirmationMessage; // Algumas versões do Chrome precisam disso
      }
    });

    // call game/eng
    window.addEventListener("unload", () => {
      const currentState = DB.getState();

      onClose(
        currentState === GAME_STATE.OVER || currentState === GAME_STATE.WIN
      );
    });

    const handleLoad = async () => {
      if (typeof onGameStart === "function") {
        const hasCoin = await onGameStart();

        if (!hasCoin) {
          console.log("Não tem fichas");
          return;
        }
      }

      const instance = getEngine();

      if (debug) {
        instance.debug.inspect = debug;
      }

      // Store the Kaboom instance in the state
      setEngine(instance);

      // Initialize the game with the Kaboom instance
      game(instance, isFullscreen);
    };

    const timeoutStart = setTimeout(async () => {
      settingsInitialize();
      await handleLoad();
    }, 300);

    return () => {
      clearInterval(timeoutStart);
    };
  }, [game, debug, onClose, onGameStart, isFullscreen]);

  return (
    <EngineContext.Provider value={{ context: engine }}>
      <div className="w-svw h-svh">
        {gameState !== GAME_STATE.BLOCKED && (
          <>
            <div
              className={`w-svw ${
                isFullscreen ? "h-full" : "h-2/3"
              } z-0 p-4 bg-black`}
            >
              <canvas id="game" className="w-svw h-1/2 z-0"></canvas>
              {gameState === GAME_STATE.PAUSED && <Menu engine={engine} />}
              {gameState === GAME_STATE.OVER && <Score gameId={gameId} />}
            </div>
            <div
              className={`w-svw ${
                isFullscreen ? "h-0" : "h-1/3"
              } ctn-controller rounded-b-4xl overflow-hidden`}
            >
              <div className="w-full">
                <Joystick
                  engine={engine}
                  onPressUp={onPressUp}
                  onPressDown={onPressDown}
                  onPressLeft={onPressLeft}
                  onPressRight={onPressRight}
                  onPressA={onPressA}
                  onIdle={onIdle}
                />
              </div>
            </div>
          </>
        )}

        {gameState === GAME_STATE.BLOCKED && <Blocked />}
        {children}
      </div>
    </EngineContext.Provider>
  );
};

export default EngineContext;
