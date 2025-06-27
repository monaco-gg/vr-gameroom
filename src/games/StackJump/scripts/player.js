"use client";

import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";

/**
 * Creates and initializes a player entity within the Kaboom game context.
 *
 * @param {KaboomCtx} context - The Kaboom context where game entities are managed.
 * @returns {GameObj} A game object representing the player, complete with predefined behaviors and properties.
 */
export default function createPlayer(context) {
  const playerSize = 90
  const deviceCenterVerticalPoint = context.height() / 2;
  const deviceCenterHorizontalPoint = context.width() / 2;
  const playerCenterVerticalPoint = playerSize / 2;

  const player = context.add([
    context.sprite("player", { anim: "idle", width: playerSize }),
    context.pos(deviceCenterHorizontalPoint, context.height() - SETTINGS.FLOOR_HEIGHT - 4),
    context.scale(1),
    context.rotate(0),
    context.anchor("bot"),
    context.area({
      shape: new context.Rect(context.vec2(0), 20, 20)
    }),
    context.body(),
    context.z(3),
    context.offscreen({ destroy: true }),
    "player",
    { isDead: false, deathTimer: 0, rotationSpeed: 190 },
  ]);
  
  // One-Way-Platform logic
  player.onBeforePhysicsResolve(collision => {
    if (collision.target.is("obstacle") && (player.isJumping() || collision.isLeft() || collision.isRight())) {
      collision.preventResolution();
    }
  });

  player.onUpdate(() => {
    // center the camera on the character after they reach the vertical center of the screen
    const playerPosition = player.pos.y - playerCenterVerticalPoint;
    if (playerPosition < deviceCenterVerticalPoint) {
      context.camPos(deviceCenterHorizontalPoint, playerPosition)
    }

    // death's animation if player is dead
    if (player.isDead) {
      const duration = 1;
      const animation = Math.max(0, 1 * (1 - player.deathTimer / duration));
      
      player.deathTimer += dt();
      player.angle += player.rotationSpeed * dt();
      player.scale = context.vec2(animation, animation);
      player.opacity = animation;
    }
  })

  return player;
}
