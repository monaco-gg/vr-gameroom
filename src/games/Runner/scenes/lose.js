"use client";

import { GAME_STATE } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";

/**
 * Creates a 'lose' scene for a game using a given Kaboom context. This scene displays
 * the final score and provides a way for the player to restart the game by clicking anywhere on the screen.
 *
 * @param {import("kaboom").KaboomCtx} context - The Kaboom context to which the scene will be added.
 */
export default async function createLoseScene(context) {
  context.scene("lose", () => {
    DB.setState(GAME_STATE.OVER);

    // Adds the "Game over" text to the scene
    context.add([
      context.text("Fim de jogo", {
        font: "VT323",
        // Transform each character for special effects
        transform: (idx, ch) => ({
          scale: context.wave(1, 1.2, context.time() * 3 + idx),
          angle: context.wave(-9, 9, context.time() * 3 + idx),
        }),
      }),
      context.color(0, 0, 0),
      context.pos(context.width() / 2, context.height() / 2),
      context.scale(1),
      context.anchor("center"),
    ]);

    // Setup interaction for restarting the game
    // Cleans up the scene before restarting
    context.destroyAll("obstacle");
    context.destroyAll("player");
    context.destroyAll("background");
    context.destroyAll("ground");
  });
}
