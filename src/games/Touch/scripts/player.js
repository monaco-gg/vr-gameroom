"use client";

import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";

/**
 * Creates and initializes a player entity within the Kaboom game context. The player has the ability to jump
 * using either the space key or a mouse click within the game area.
 *
 * @param {KaboomCtx} context - The Kaboom context where game entities are managed.
 * @returns {GameObj} A game object representing the player, complete with predefined behaviors and properties.
 */
export default function createPlayer(context) {
  const playerSize =
    (context.width() - SETTINGS.TRAFFIC_LIGHT_MARGIN * (SETTINGS.NUMBER_TRAFFIC_LIGHTS + 1)) /
    SETTINGS.NUMBER_TRAFFIC_LIGHTS;

  let player = null;

  [...Array(SETTINGS.NUMBER_TRAFFIC_LIGHTS)].map((_, counter) => {
    ++counter;
    const greenLight = context.add([
      context.circle(playerSize / 2, playerSize / 2),
      context.color(0, 255, 0),
      context.pos(
        counter * (playerSize + SETTINGS.TRAFFIC_LIGHT_MARGIN / 1.05),
        context.height() / 2.07 - playerSize / 2
      ),
      context.anchor("right"),
      context.z(4),
      `player_${counter}`,
      { isDead: false, createdAt: null, touchedAt: null, falseStart: false }
    ]);

    if (counter === 1) player = greenLight;
  });
  
  context.play('green_light', { speed: 1, volume: 0.1 });
  
  player.onUpdate(() => {
    if (player.createdAt === null) {
      player.createdAt = new Date();
    }
  });

  return player;
}
