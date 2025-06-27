import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";

/**
 * Initializes the game world settings using the provided Kaboom context.
 * This function orchestrates setting the environment, creating background, and ground for the game world.
 *
 * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
 */
export default function createWorld(context) {
  const GRAVITY = 0;
  const BACKGROUND_COLOR = { r: 112, g: 112, b: 112 };

  setEnvironment(context, GRAVITY, BACKGROUND_COLOR);
  createBackground(context);
}

/**
 * Sets the environment for the game by adjusting gravity and background color.
 *
 * @param {KaboomCtx} context - The game context to modify.
 * @param {number} gravity - The gravity setting for the game world.
 * @param {Object} backgroundColor - The RGB values for the background color.
 */
function setEnvironment(context, gravity, backgroundColor) {
  context.setGravity(gravity);
  context.setBackground(
    backgroundColor.r,
    backgroundColor.g,
    backgroundColor.b
  );
}

/**
 * Creates and adds a background sprite to the game world.
 *
 * @param {KaboomCtx} context - The game context to which the background will be added.
 */
function createBackground(context) {
  const scale = 1.5;
  const width = 361;
  const height = 818;
  const totalBackgrounds = 9;

  // TO DO: Transform in a custom component ref(https://kaboomjs.com/doc/comp)
  function destroyBackground() {
    return {
      id: "destroyBackground",
      update() {
        if (this.pos.y > height) {
          this.destroy();
        }
      },
    };
  }

  for (let i = 0; i <= totalBackgrounds; i++) {
    let tag = "bg";
    let posY = -height * i * scale;

    if (i === 9) {
      tag = "background";
    }

    context.add([
      context.sprite(`bg-${i}`, {
        width,
        height,
      }),
      context.scale(scale),
      context.pos(0, posY),
      context.move(context.DOWN, SETTINGS.BG_SPEED),
      destroyBackground(),
      tag,
    ]);
  }
}
