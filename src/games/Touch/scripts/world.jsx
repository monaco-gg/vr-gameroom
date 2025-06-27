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
  const BACKGROUND_COLOR = { r: 0, g: 0, b: 0 };

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

  createSemaphore(context);
}

/**
 * Creates and adds a background sprite to the game world.
 *
 * @param {KaboomCtx} context - The game context to which the background will be added.
 */
function createBackground(context) {
  const scale = 1;
  const height = 960;
  const deviceWidth = context.width();
  const deviceHeight = context.height();
  const totalBackgrounds = 8;

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
    let backgroundName = "background";
    let posY = deviceHeight - (height * i * scale);

    if (i !== 0) {
      backgroundName = "background_repeat";
    }

    context.add([
      context.sprite(backgroundName, {
        width: deviceWidth,
        height
      }),
      context.scale(scale),
      context.anchor("bot"),
      context.pos(deviceWidth / 2, posY),
      //destroyBackground(),
    ]);
  }
}

/**
 * Create semaphore OFF
 *
 * @param {KaboomCtx} context - The game context to modify.
 */
function createSemaphore(context) {

  const playerSize =
    (context.width() - SETTINGS.TRAFFIC_LIGHT_MARGIN * (SETTINGS.NUMBER_TRAFFIC_LIGHTS + 1)) /
    SETTINGS.NUMBER_TRAFFIC_LIGHTS;
  
  [...Array(SETTINGS.NUMBER_TRAFFIC_LIGHTS * 2).keys()].map((_, counter) => {
    ++counter;
    let posY;
    let pos;
    let color;
    if (counter <= SETTINGS.NUMBER_TRAFFIC_LIGHTS) {
      posY = context.height() / 2.07 - playerSize / 2
      pos = counter
      color = {r: 46, g: 76, b: 45};
    } else {
      posY = context.height() / 2 + playerSize / 2
      pos = counter - SETTINGS.NUMBER_TRAFFIC_LIGHTS;
      color = {r: 129, g: 66, b: 66};
    }
    
    context.add([
      context.circle(playerSize / 2, playerSize / 2),
      context.color(color.r, color.g, color.b),
      context.pos(
        pos * (playerSize + SETTINGS.TRAFFIC_LIGHT_MARGIN / 1.05),
        posY
      ),
      context.anchor("right"),
      context.z(4),
      `trafficLight${counter}`,
    ]);
  })

  context.add([
    context.sprite("traffic_bg", {
      width: context.width() - 5,
      height: playerSize * 3.5,
    }),
    context.color(71, 99, 120),
    context.pos(
      0,
      context.height() / 2
    ),
    context.anchor("left"),
    context.z(3),
    `trafficLightBackground`,
  ]);
}
