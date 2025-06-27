import { SETTINGS } from "../settings";

export default function createCoin(context, player) {
  // Initial delay before creating an obstacle
  context.wait(1, () => {
    // Check if the player is alive before creating an obstacle
    if (!player.isDead) {
      // Adds an obstacle with various properties
      const coin = context.add([
        context.sprite("coin", {
          width: 30,
          height: 50,
        }),

        // Creates a rectangle with random height
        //context.rect(20, 20),
        // Adds collision detection to the rectangle
        context.area(),

        // context.body({ mass: 1 }),

        // Adds an outline with a width of 1
        context.outline(1),
        // Positions the rectangle at the bottom of the canvas, adjusted by the floor height
        //context.pos(context.width(), context.height() - SETTINGS.FLOOR_HEIGHT),
        context.pos(rand(20, width() - 20), 0),
        //context.pos(context.width() + 20, context.height() - 100),
        // Sets the anchor point to the bottom left of the rectangle
        context.anchor("botleft"),
        // Sets the color of the rectangle
        context.color(255, 255, 0),
        // Makes the rectangle move to the left at a defined speed
        context.move(context.DOWN, SETTINGS.SPEED),
        // Destroys the rectangle once it goes off-screen
        context.offscreen({ destroy: true }),
        // Tags the rectangle as "tree" for potential querying
        "coin",
      ]);
      coin.play("rotate");
    }

    // Recursively create another obstacle after a random delay
    context.wait(context.rand(4, 8), () => {
      createCoin(context, player);
    });
  });
}
