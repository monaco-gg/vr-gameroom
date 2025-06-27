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

  // SPRITES
  context.loadSprite("enemy1", "/games/ShootEmUp/sprites/enemy-01.png");
  context.loadSprite("enemy2", "/games/ShootEmUp/sprites/enemy-02.png");
  context.loadSprite("enemy3", "/games/ShootEmUp/sprites/enemy-03.png");

  context.loadSprite("heart", "/games/ShootEmUp/sprites/heart.png");

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

  // Load background sprite
  for (var i = 0; i <= 9; i++) {
    context.loadSprite(
      `bg-${i}`,
      `/games/ShootEmUp/sprites/background/Day One - ${i}.png`
    );
  }

  context.loadSprite("missile", "/games/ShootEmUp/sprites/missile.png");

  context.loadSprite("fire", "/games/ShootEmUp/sprites/fire6_64.png", {
    sliceX: 10,
    sliceY: 6,
    anims: {
      play: {
        from: 0,
        to: 59,
        speed: 30,
        loop: true,
      },
    },
  });

  context.loadSprite("explosion", "/games/ShootEmUp/sprites/explosion.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      play: {
        from: 0,
        to: 15,
        speed: 30,
        loop: true,
      },
    },
  });

  context.loadSprite("airplane", "/games/ShootEmUp/sprites/airplane.png", {
    width: 20,
    height: 20,
    sliceX: 5,
    sliceY: 3,
    anims: {
      run: 2,
      left: {
        from: 2,
        to: 0,
        speed: 16,
        loop: false,
      },
      right: {
        from: 2,
        to: 4,
        speed: 16,
        loop: false,
      },
      dead: {
        from: 5,
        to: 14,
        speed: 10,
        loop: false,
      },
    },
  });

  // SOUND EFFECTS
  context.loadSound("bg", "/games/ShootEmUp/sounds/bg/bg.mp3");
  context.loadSound("shoot", "/games/ShootEmUp/sounds/fx/shoot.mp3");
  context.loadSound("shootEnemy", "/games/ShootEmUp/sounds/fx/shootEnemy.mp3");
  context.loadSound("gameover", "/games/ShootEmUp/sounds/fx/gameover.mp3");
  context.loadSound("fireball", "/games/ShootEmUp/sounds/fx/fireball.mp3");

  return context;
};

export default loadSprites;
