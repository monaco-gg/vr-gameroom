import { KaboomCtx } from "kaboom";

/**
 * Loads game assets such as sprites with specific configurations into the Kaboom context.
 * This function manages the loading of various game sprites and their animations, using a helper
 * function to simplify the process and reduce redundancy.
 *
 * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
 * @returns {KaboomCtx}
 */
const loadSprites = (context) => {
  // SHADER
  context.loadShaderURL("heat", null, `/shaders/heat.frag`);
  context.loadShaderURL("crt", null, `/shaders/crt.frag`);
  context.usePostEffect("crt", () => ({
    u_flatness: 5,
  }));

  // FONTS
  context.loadFont("VT323", "/fonts/VT323/VT323-Regular.ttf");

  // SOUNDS
  context.loadSound("bg", "/games/StackJump/sounds/bg/bg.mp3");
  context.loadSound("alert", "/games/StackJump/sounds/alert.mp3");
  context.loadSound("gameover", "/games/StackJump/sounds/gameover.mp3");
  context.loadSound("jump", "/games/StackJump/sounds/jump.mp3");
  context.loadSound("perfect", "/games/StackJump/sounds/perfect.mp3");

  // SPRITES
  context.loadSprite("heart", "/games/StackJump/sprites/heart.png");
  context.loadSprite("alert", "/games/StackJump/sprites/red_exclamation_mark.png");

  // Load background sprite
  context.loadSprite("bg-0", "/games/StackJump/sprites/bg/BG_0.png");
  context.loadSprite("bg-1", "/games/StackJump/sprites/bg/BG_1.png");
  context.loadSprite("bg-2", "/games/StackJump/sprites/bg/BG_2.png");

  // Load background sprite
  context.loadSprite("ground", "/games/StackJump/sprites/bg/ground-000-0.png");
  context.loadSprite("platform", "/games/StackJump/sprites/obstacle/flying-platform.png");

  context.loadSprite("load", "/games/monaco-pixeled.png", {
    width: 400,
    height: 400,
    sliceX: 5,
    sliceY: 3,
    anims: {
      anim: {
        from: 0,
        to: 13,
        speed: 10,
        loop: true,
      },
    },
  });

  context.loadSprite("player", "/games/StackJump/sprites/player.png", {
    width: 64,
    height: 64,
    sliceX: 13,
    sliceY: 29,
    anims: {
      idle: {
        from: 0,
        to: 2,
        speed: 6,
        loop: true,
      },
      jump: {
        from: 52,
        to: 56,
        speed: 10,
        loop: false,
      },
      death: {
        from: 369,
        to: 369,
        speed: 5,
        loop: false
      }
    },
  });

  context.loadSprite("fire", "/games/StackJump/sprites/obstacle/fire.png", {
    sliceX: 8,
    sliceY: 8,
    anims: {
      run: {
        from: 0,
        to: 59,
        speed: 16,
        loop: true,
      },
      death: {
        from: 60,
        to: 63,
        speed: 16,
        loop: false
      }
    },
  });

  return context;
};

export default loadSprites;
