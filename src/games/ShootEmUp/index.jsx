"use client";

import { GAME_ORIENTATION, GAME_STATE } from "../../app/contexts/EngineContext";
import { DB } from "../../app/utils/storage";
import { SETTINGS } from "../ShootEmUp/settings";
import loadSprites from "./resources/sprites";
import createGameScene from "./scenes/game";
import createLoseScene from "./scenes/lose";
import createSplashScene from "./scenes/splash";

const ShootEmUpGame = {
  orientation: GAME_ORIENTATION.PORTRAIT,

  /**
   * Initializes and starts the game.
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
   * Handles the action when button A is pressed.
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

      if (player && !player.isDead) {
        // Create a missile for the player
        context.add([
          context.sprite("missile", {
            width: 30,
            height: 50,
          }),
          context.area({
            shape: new context.Rect(context.vec2(0), 10, 50),
          }),
          context.pos(player.pos.add(0, 0)),
          context.anchor("center"),
          context.move(context.UP, SETTINGS.BULLET_SPEED),
          context.offscreen({ destroy: true }),
          "bullet",
        ]);
        context.play("shootEnemy", { volume: 0.4 });
      }
    }
  },

  /**
   * Handles the action when the up button is pressed.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onPressUp: (context) => {
    const state = DB.getState();

    if (state === GAME_STATE.RUNNING) {
      const player = context.get("player")[0];

      if (player && !player.isDead) {
        player.move(0, -SETTINGS.SPEED);
        if (player.anim !== "run") {
          player.play("run");
          player.anim = "run";
        }

        if (player.get("fire").length === 0) {
          player.add([
            context.sprite("fire", { anim: "play" }),
            context.anchor("center"),
            context.pos(0, player.height - 20),
            "fire",
          ]);
        }

        if (player.pos.y < 0) {
          player.pos.y = 0;
        }
      }
    }
  },

  /**
   * Handles the action when the down button is pressed.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onPressDown: (context) => {
    const state = DB.getState();

    if (state === GAME_STATE.RUNNING) {
      const player = context.get("player")[0];

      if (player && !player.isDead) {
        player.move(0, SETTINGS.SPEED);
        if (player.anim !== "run") {
          player.play("run");
          player.anim = "run";
        }

        if (player.get("fire").length > 0) {
          player.children.forEach((child) => {
            child.destroy();
          });
        }

        if (player.pos.y > context.height() - player.height) {
          player.pos.y = context.height() - player.height;
        }
      }
    }
  },

  /**
   * Handles the action when the left button is pressed.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onPressLeft: (context) => {
    const state = DB.getState();

    if (state === GAME_STATE.RUNNING) {
      const player = context.get("player")[0];

      if (player && !player.isDead) {
        player.move(-SETTINGS.SPEED, 0);
        if (player.anim !== "left") {
          player.play("left");
          player.anim = "left";
        }
        if (player.pos.x < 0) {
          player.pos.x = 0;
        }
      }
    }
  },

  /**
   * Handles the action when the right button is pressed.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onPressRight: (context) => {
    const state = DB.getState();

    if (state === GAME_STATE.RUNNING) {
      const player = context.get("player")[0];

      if (player && !player.isDead) {
        player.move(SETTINGS.SPEED, 0);

        if (player.anim !== "right") {
          player.play("right");
          player.anim = "right";
        }

        if (player.pos.x > context.width() - player.width) {
          player.pos.x = context.width() - player.width;
        }
      }
    }
  },

  /**
   * Handles the action when the game is idle.
   *
   * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
   */
  onIdle: (context) => {
    const state = DB.getState();

    if (state === GAME_STATE.RUNNING) {
      const player = context.get("player")[0];

      if (player && !player.isDead) {
        if (player.anim !== "run") {
          player.play("run");
          player.anim = "run";
        }
      }
    }
  },
};

export default ShootEmUpGame;
