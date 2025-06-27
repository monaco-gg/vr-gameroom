import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";
import { getSpeedIncrement } from "./speed";

/**
 * Creates a coin sprite in the game context.
 *
 * @param {KaboomCtx} context - The Kaboom game context.
 * @param {Object} player - The player object.
 * @param {boolean} player.isDead - Flag indicating whether the player is dead.
 */
export default function createCoin(context, player) {
  // Initial delay before creating a coin
  context.wait(1, () => {
    // Check if the player is alive before creating a coin
    if (!player.isDead) {
      // Adds a coin with various properties
      const coin = context.add([
        context.sprite("coin", {
          width: 30,
          height: 50,
        }),
        context.area(),
        context.outline(1),
        context.pos(context.width() + 20, context.height() - 160),
        context.anchor("botleft"),
        context.color(255, 255, 0),
        context.move(context.LEFT, SETTINGS.SPEED + getSpeedIncrement()),
        context.offscreen({ destroy: true }),
        "coin",
      ]);
      coin.play("rotate");
    }

    // Recursively create another coin after a random delay
    context.wait(context.rand(4, 8), () => {
      createCoin(context, player);
    });
  });
}
