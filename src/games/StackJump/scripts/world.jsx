import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";

/**
 * Initializes the game world settings using the provided Kaboom context.
 * This function orchestrates setting the environment, creating background, and ground for the game world.
 *
 * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
 */
export default function createWorld(context) {
  const GRAVITY = 650;
  const BACKGROUND_COLOR = { r: 0, g: 0, b: 0 };
  const GROUND_COLOR = { r: 0, g: 17, b: 55 };
  const FLOOR_HEIGHT = SETTINGS.FLOOR_HEIGHT;

  setEnvironment(context, GRAVITY, BACKGROUND_COLOR);
  createBackground(context);
  createGround(context, GROUND_COLOR, FLOOR_HEIGHT);
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
  context.usePostEffect("heat", () => ({
    u_flatness: 5,
    u_time: time(),
    u_heat_intensity: 0.004,
    u_movement_intensity: 0.0005
  }));
}

/**
 * Creates and adds a background sprite to the game world.
 *
 * @param {KaboomCtx} context - The game context to which the background will be added.
 */
function createBackground(context) {
  const scale = 1;
  const width = 464;
  const height = 700;
  const deviceWidth = context.width();
  const deviceHeight = context.height();
  const totalBackgrounds = 2;

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
    let posY = deviceHeight - (height * i * scale);

    if (i === 1) {
      tag = "background";
    }

    context.add([
      context.sprite(`bg-${i}`, {
        width,
        height,
      }),
      context.scale(scale),
      context.anchor("bot"),
      context.pos(deviceWidth / 2, posY),
      destroyBackground(),
      tag,
    ]);
  }
}

/**
 * Configures and adds a ground element to the game world with specified properties.
 *
 * @param {KaboomCtx} context - The game context where the ground will be added.
 * @param {Object} groundColor - The RGB values for the color of the ground.
 */
function createGround(context, groundColor, height) {
  const groundProps = {
    width: context.width(),
    height,
    position: { x: 0, y: context.height() },
    isStatic: true,
    color: groundColor,
  };
  addGround(context, groundProps);
}

/**
 * Adds a ground element to the game context based on provided properties.
 *
 * @param {KaboomCtx} context - The game context where the ground is to be added.
 * @param {Object} props - The properties defining the ground's attributes such as width, height, position, static nature, and color.
 */
function addGround(context, { width, height, position, isStatic, color }) {
  const ground = [
    context.rect(width, height),
    context.outline(0),
    context.pos(position.x, position.y),
    context.anchor("botleft"),
    context.area(),
    context.body({ isStatic }),
    context.opacity(0),
    context.color(color.r, color.g, color.b),
    "ground",
  ];
  context.add(ground);
}
