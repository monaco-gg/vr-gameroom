import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";
import { getSpeedIncrement } from "./speed";

/**
 * TODO: Remove (or isolate) LEVEL logic.
 *
 * Dynamically generates obstacles in the game at random intervals and positions.
 * If the player is not dead, an obstacle is created and automatically moves across the screen.
 * New obstacles are generated recursively at random intervals.
 *
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {object} player - The player object to check if the player is still alive.
 */
export default function createObstacle(context, player) {
  // Initial delay before creating an obstacle
  context.wait(1, () => {
    if (!player.isDead) {
      const obstacleId = parseInt(context.rand(1, 5));
      const obstacle = context.sprite(`obstacle${obstacleId}`, {
        width: obstacleId === 4 ? 70 : 30,
        height: 60,
      });

      // Adds an obstacle with various properties
      context.add([
        obstacle,

        // Creates a rectangle with random height
        // context.rect(14, context.rand(20, 60)),
        // Adds collision detection to the rectangle
        context.area(),
        context.body({ mass: 1 }),

        // Adds an outline with a width of 1
        // context.outline(1),
        // Positions the rectangle at the bottom of the canvas, adjusted by the floor height
        //context.pos(context.width(), context.height() - SETTINGS.FLOOR_HEIGHT),

        context.pos(
          context.width() - 10,
          context.height() - SETTINGS.FLOOR_HEIGHT
        ),
        // Sets the anchor point to the bottom left of the rectangle
        context.anchor("botleft"),
        // Sets the color of the rectangle
        // context.color(60, 60, 60),
        // Makes the rectangle move to the left at a defined speed
        context.move(context.LEFT, SETTINGS.SPEED + getSpeedIncrement()),
        // Destroys the rectangle once it goes off-screen
        context.offscreen({ destroy: true }),
        // Tags the rectangle as "tree" for potential querying
        "obstacle",
      ]);
    }

    // Recursively create another obstacle after a random delay
    context.wait(context.rand(0.5, 2), () => {
      createObstacle(context, player);
    });
  });
}
