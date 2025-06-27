"use client";

import { KaboomCtx } from "kaboom";

/**
 * Creates and initializes a player entity within the Kaboom game context. The player has the ability to jump
 * using either the space key or a mouse click within the game area.
 *
 * @param {KaboomCtx} context - The Kaboom context where game entities are managed.
 * @returns {GameObj} A game object representing the player, complete with predefined behaviors and properties.
 */
export default function createPlayer(context) {
  const player = context.add([
    context.sprite("airplane", { anim: "run" }),
    context.pos(context.width() / 2, context.height() - 90),
    context.scale(0.7),
    context.area(),
    context.anchor("center"),
    context.z(2),
    "player",
    context.offscreen({ destroy: true }),
    { isDead: false },
  ]);

  return player;
}
