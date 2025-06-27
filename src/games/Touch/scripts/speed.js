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
      return 150;
    case GAME_LEVEL.MEDIUM:
      return 350;
    case GAME_LEVEL.HARD:
      return 450;
    case GAME_LEVEL.EXTREME:
      return 550;
    default:
      return 150;
  }
};
