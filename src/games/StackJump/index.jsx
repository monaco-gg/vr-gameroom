"use client";

import { GAME_ORIENTATION, GAME_STATE } from "../../app/contexts/EngineContext";
import { DB } from "../../app/utils/storage";
import loadSprites from "./resources/sprites";
import createGameScene from "./scenes/game";
import createLoseScene from "./scenes/lose";
import createSplashScene from "./scenes/splash";
import { SETTINGS } from "./settings";

const StackJumpGame = {
  orientation: GAME_ORIENTATION.PORTRAIT,

  /**
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  game: function StackJumpGame(context) {
    loadSprites(context);
    createSplashScene(context);
    createGameScene(context);
    createLoseScene(context);
    context.go("splash");
  },

  /**
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onPressA: function onPressA(context) {
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
        player.play("jump");
        player.jump(SETTINGS.JUMP_FORCE);
        context.play("jump", {
          volume: 0.2,
        });
      }
    }
  },
};

export default StackJumpGame;
