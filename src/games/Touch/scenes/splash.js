"use client";

import { GAME_STATE } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";

/**
 * Creates a 'lose' scene for a game using a given Kaboom context. This scene displays
 * the final score and provides a way for the player to restart the game by clicking anywhere on the screen.
 *
 * @param {import("kaboom").KaboomCtx} context - The Kaboom context to which the scene will be added.
 */
export default async function createSplashScene(context, isFullscreen) {
  context.scene("splash", async () => {
    DB.setState(GAME_STATE.LOADING);
    context.setBackground(context.color(0, 0, 0));

    const load = context.add([
      context.sprite("load"),
      context.pos(context.width() / 2 + 20, context.height() / 2),
      context.scale(1),
      context.anchor("center"),
      "load",
    ]);

    load.play("anim");

    setTimeout(() => {
      load.destroy();

      context.add([
        context.text(isFullscreen ? "Aperte o botão [wavy]🟢[/wavy] para" : "Aperte o botão [wavy]A[/wavy] para", {
          font: "VT323",
          styles: {
            purple: {
              color: rgb(128, 128, 255),
            },
            wavy: (idx, ch) => ({
              color: context.rgb(128, 128, 255),
              pos: context.vec2(
                0,
                context.wave(-4, 4, context.time() * 6 + idx * 0.5)
              ),
            }),
          },
          // Transform each character for special effects
          // transform: (idx, ch) => ({
          //   scale: context.wave(1.3, 1.2, context.time() * 6 + idx),
          //   angle: context.wave(-30, 9, context.time() * 3 + idx),
          //   opacity: context.wave(0, 1, context.time() * 4),
          // }),
        }),
        context.color(255, 255, 255),
        context.pos(context.width() / 2, context.height() / 2),
        context.scale(1),
        context.anchor("center"),
      ]);

      // Adds the "Game over" text to the scene
      context.add([
        context.text("iniciar o jogo.", {
          font: "VT323",
          // transform: (idx, ch) => ({
          //   scale: context.wave(1, 1.2, context.time() * 3 + idx),
          //   angle: context.wave(-9, 9, context.time() * 3 + idx),
          // }),
        }),
        context.color(255, 255, 255),
        context.pos(context.width() / 2, context.height() / 2 + 60),
        context.scale(1),
        context.anchor("center"),
      ]);

      DB.setState(GAME_STATE.WAITING);
    }, 3000);
  });
}
