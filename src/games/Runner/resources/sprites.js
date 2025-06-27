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
  context.loadShaderURL("crt", null, `/shaders/crt.frag`);

  context.usePostEffect("crt", () => ({
    u_flatness: 5,
  }));

  // context.loadShaderURL("vhs", null, `/shaders/vhs.frag`);

  // context.usePostEffect("vhs", () => ({
  //   u_intensity: 18,
  // }));

  // FONTS
  context.loadFont("VT323", "/fonts/VT323/VT323-Regular.ttf");

  // SPRITES
  context.loadSprite("heart", "/games/Runner/sprites/heart.png");
  context.loadSprite(
    "obstacle1",
    "/games/Runner/sprites/obstacle/extintor.png"
  );
  context.loadSprite(
    "obstacle2",
    "/games/Runner/sprites/obstacle/cone-001.png"
  );
  context.loadSprite(
    "obstacle3",
    "/games/Runner/sprites/obstacle/cone-002.png"
  );
  context.loadSprite("obstacle4", "/games/Runner/sprites/obstacle/wheel.png");

  // Load background sprite
  context.loadSprite("bg", "/games/Runner/sprites/bg/background.jpg");

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

  context.loadSprite("coin", "/games/Runner/sprites/coin.png", {
    width: 150,
    height: 202,
    sliceX: 7,
    sliceY: 1,
    anims: {
      rotate: {
        from: 0,
        to: 6,
        speed: 13,
        loop: true,
      },
    },
  });

  context.loadSprite("player", "/games/Runner/sprites/player.png", {
    width: 200,
    height: 200,
    sliceX: 10,
    sliceY: 2,
    anims: {
      run: {
        from: 0,
        to: 9,
        speed: 16,
        loop: true,
      },
      jump: {
        from: 10,
        to: 15,
        speed: 5,
        loop: true,
      },
      dead: {
        from: 16,
        to: 19,
        speed: 5,
        loop: false,
      },
    },
  });

  // SOUND EFFECTS
  context.loadSound("music", "/games/Runner/sounds/bg/music-2.mp3");
  context.loadSound("jump", "/games/Runner/sounds/fx/jump-1.wav");
  context.loadSound("impact", "/games/Runner/sounds/fx/impact-0.mp3");
  context.loadSound("gameover", "/games/Runner/sounds/fx/gameover-0.mp3");
  context.loadSound("coin", "/games/Runner/sounds/fx/coin-0.mp3");
  context.loadSound("running", "/games/Runner/sounds/fx/running-0.mp3");

  return context;
};

export default loadSprites;
