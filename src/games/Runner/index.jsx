"use client";

import { GAME_ORIENTATION, GAME_STATE } from "../../app/contexts/EngineContext";
import { DB } from "../../app/utils/storage";
import loadSprites from "./resources/sprites";
import createGameScene from "./scenes/game";
import createLoseScene from "./scenes/lose";
import createSplashScene from "./scenes/splash";
import { SETTINGS } from "./settings";

const RunnerGame = {
  orientation: GAME_ORIENTATION.PORTRAIT,

  /**
   * Initializes and starts the game, setting up the necessary scenes and assets.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  game: (context) => {
    loadSprites(context);
    createSplashScene(context);
    createGameScene(context);
    createLoseScene(context);
    context.go("splash");
  },

  /**
   * Handles the action when the "A" button is pressed.
   *
   * - If the game state is LOADING, no action is taken.
   * - If the game state is WAITING, the game state transitions to "game".
   * - If the game state is RUNNING, the player character will jump if they are grounded and not dead or already jumping.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onPressA: (context) => {
    const currentState = DB.getState();

    if (currentState === GAME_STATE.LOADING) {
      return;
    }

    if (currentState === GAME_STATE.WAITING) {
      context.go("game");
      return;
    }

    if (currentState === GAME_STATE.RUNNING) {
      const player = context.get("player")[0];

      if (
        player &&
        player.isGrounded() &&
        !player.isDead &&
        !player.isJumping()
      ) {
        context.play("jump", { volume: 0.8 });
        player.play("jump");
        player.jump(SETTINGS.JUMP_FORCE);
      }
    }
  },
};

export default RunnerGame;
