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
    // Creates a rectangle with random height
    // context.rect(40, 80),
    // context.color(0, 254, 0),
    context.sprite("player", { anim: "run" }),
    context.pos(20, context.height() - 200),
    context.scale(0.5),
    // context.outline(1),
    // context.area(),
    context.area({
      shape: new context.Rect(context.vec2(0), 100, 160),
      offset: context.vec2(50, 34),
    }),
    context.body(),
    context.z(1),
    "player",
    context.offscreen({ destroy: true }),
    context.state("running", ["running", "jumping", "dead"]),
    { isDead: false, anim: "run" },
  ]);

  return player;
}
