"use client";

import { useSearchParams } from "next/navigation";
import RunnerGame from "../../../games/Runner";
import ShootEmUpGame from "../../../games/ShootEmUp";
import StackJumpGame from "../../../games/StackJump";
import TouchGame from "../../../games/Touch";
import { post } from "../../../utils/apiClient";
import { EngineProvider } from "../../contexts/EngineContext";
import { DB } from "@app/utils/storage";

/**
 * Page component that sets up and renders a specific game within a game engine context.
 *
 * @param {object} props - Properties passed to the component.
 * @param {object} props.params - Route parameters including the game id.
 * @returns {JSX.Element} Returns the game engine provider configured for the specific game.
 */
const Page = ({ params: { id } }) => {
  const searchParams = useSearchParams();
  const debug = searchParams.get("debug") || false;
  const coins = searchParams.get("coins") || false;
  const rotate = searchParams.get("rotate") || false;

  // Game catalog with corresponding identifiers
  const catalog = {
    1: RunnerGame,
    2: ShootEmUpGame,
    3: StackJumpGame,
    4: TouchGame,
  };

  if (catalog[id] === undefined) {
    return false;
  }

  /**
   * Function executed when the game starts.
   */
  const handleGameStart = async () => {
    if (coins) {
      return true;
    }

    try {
      const response = await post(
        "/api/games/start",
        {
          gameId: id,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status < 300) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  };

  /**
   * Function executed when the game pauses.
   */
  const handleGamePause = () => {
    // console.log("game pause");
  };

  /**
   * Function executed when there are updates in the game, such as score changes.
   *
   * @param {number} score - Current score of the game.
   */
  const handleGameUpdate = () => {
    // (score);
  };

  /**
   * Function executed when the game ends.
   *
   * @param {number} tickets - Final score of the game.
   */
  const handleGameOver = async (amount) => {
    if (coins) {
      return true;
    }

    const playerData = DB.getData();

    // TODO: Implement UUID to avoid in-game registration duplication

    try {
      const response = await post(
        "/api/games/end",
        {
          gameId: id,
          playerData,
          amount,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status < 300) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  };

  /**
   * Function executed when the game is close.
   *
   * @param {boolean} isOver
   */
  const handleClose = async (isOver) => {
    try {
      if (coins) {
        return true;
      }

      // TODO: Implement UUID to avoid in-game registration duplication

      if (!isOver && navigator) {
        navigator.sendBeacon(
          "/api/games/end",
          JSON.stringify({
            gameId: id,
            amount: 0,
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <EngineProvider
      game={catalog[id].game}
      orientation={catalog[id].orientation}
      gameId={id}
      rotate={rotate}
      onPressA={catalog[id].onPressA}
      onPressLeft={catalog[id].onPressLeft}
      onPressRight={catalog[id].onPressRight}
      onPressUp={catalog[id].onPressUp}
      onPressDown={catalog[id].onPressDown}
      onIdle={catalog[id].onIdle}
      onGameStart={handleGameStart}
      onGamePause={handleGamePause}
      onGameUpdate={handleGameUpdate}
      onGameOver={handleGameOver}
      onClose={handleClose}
      debug={debug}
    />
  );
};

export default Page;
