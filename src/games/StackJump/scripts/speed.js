import { GAME_LEVEL } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";

/**
 * Gets the speed increment based on the current game level.
 *
 * @returns {number} The speed increment value.
 */
export const getSpeedIncrement = () => {
  const currentLevel = DB.getLevel();

  switch (currentLevel) {
    case GAME_LEVEL.EASY:
      return 200;
    case GAME_LEVEL.MEDIUM:
      return 300;
    case GAME_LEVEL.HARD:
      return 350;
    case GAME_LEVEL.EXTREME:
      return 400;
    default:
      return 200;
  }
};
