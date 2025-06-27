import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";
import { GAME_LEVEL } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";

/**
 * Initializes the game world settings using the provided Kaboom context.
 * This function orchestrates setting the environment, creating background, and ground for the game world.
 *
 * @param {KaboomCtx} context - The Kaboom game context used to load and manage game assets.
 */
export default function createWorld(context) {
  const GRAVITY = 1200;
  const BACKGROUND_COLOR = { r: 112, g: 112, b: 112 };
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
}

/**
 * Creates and adds a background sprite to the game world.
 *
 * @param {KaboomCtx} context - The game context to which the background will be added.
 */
function createBackground(context) {
  const getSpeedIncrement = () => {
    switch (DB.getLevel()) {
      case GAME_LEVEL.EASY:
        return 50;
      case GAME_LEVEL.MEDIUM:
        return 100;
      case GAME_LEVEL.HARD:
        return 300;
      case GAME_LEVEL.EXTREME:
        return 400;
      default:
        return 50;
    }
  };

  const scale = 1;
  const width = 1750;
  const height = context.height();
  const totalBackgrounds = 9;

  // TO DO: Transform in a custom component ref(https://kaboomjs.com/doc/comp)
  function destroyBackground() {
    return {
      id: "destroyBackground",
      update() {
        if (this.pos.x < -width) {
          this.destroy();
        }
      },
    };
  }

  for (let i = 0; i <= totalBackgrounds; i++) {
    let tag = "bg";
    let posX = width * i * scale;

    if (i === 9) {
      tag = "background";
    }

    context.add([
      context.sprite("bg", {
        width,
        height,
      }),

      context.pos(posX, 0),
      // Makes the rectangle move to the left at a defined speed
      context.move(context.LEFT, SETTINGS.BG_SPEED + getSpeedIncrement()),

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
    context.opacity(0),
    context.body({ isStatic }),
    context.color(color.r, color.g, color.b),
    "ground",
  ];
  context.add(ground);
}
