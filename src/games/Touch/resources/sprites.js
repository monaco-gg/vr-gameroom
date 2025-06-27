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

  // FONTS
  context.loadFont("VT323", "/fonts/VT323/VT323-Regular.ttf");

  // SOUNDS
  context.loadSound("green_light", "/games/Touch/sounds/green_light.mp3");
  context.loadSound("red_light", "/games/Touch/sounds/red_light.mp3");
  context.loadSound("motor_loop", "/games/Touch/sounds/motor_loop.mp3");
  context.loadSound("car", "/games/Touch/sounds/car.mp3");
  context.loadSound("false_start", "/games/Touch/sounds/false_start.mp3");

  // SPRITES
  context.loadSprite("heart", "/games/Runner/sprites/heart.png");
  context.loadSprite("background", "/games/Touch/sprites/background.png");
  context.loadSprite("background_repeat", "/games/Touch/sprites/background_repeat.png");
  context.loadSprite("car", "/games/Touch/sprites/car.png");
  context.loadSprite("traffic_bg", "/games/Touch/sprites/traffic_bg.png");
  context.loadSprite("car_position", "/games/Touch/sprites/car_position.png");
  context.loadSprite("speedline", "/games/Touch/sprites/speedline.png");

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

  return context;
};

export default loadSprites;
