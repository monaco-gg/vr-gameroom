"use client";

import { KaboomCtx } from "kaboom";
import { GAME_LEVEL, GAME_STATE } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";
import createCoin from "../scripts/coin";
import createObstacle from "../scripts/obstacle";
import createPlayer from "../scripts/player";
import createProgressBar, { updateProgress } from "../scripts/progress";
import createWorld from "../scripts/world";

/**
 *
 * @param {KaboomCtx} context
 */
export default function createGameScene(context) {
  const music = context.play("music", {
    volume: 0.3,
    paused: true,
    loop: true,
  });
  const runningAudio = context.play("running", {
    volume: 0.5,
    paused: true,
    loop: true,
  });

  context.scene("game", (value) => {
    DB.setState(GAME_STATE.RUNNING);

    let distance = value || 0;
    const player = createPlayer(context);

    createWorld(context);
    createObstacle(context, player);
    createCoin(context, player);
    createProgressBar(context);

    if (DB.isMuted()) {
      context.volume(0);
    } else {
      context.volume(1);
    }

    if (music.paused) {
      music.play();
    }

    // lose if player collides with any game obj with tag "obstacle"
    player.onCollide("obstacle", () => {
      runningAudio.paused = true;
      if (!player.isDead) {
        context.play("impact", { volume: 0.8 });
      }
      player.isDead = true;
      player.play("dead");
      player.area.shape = new Rect(vec2(0), 100, 140);
      context.shake(30);

      if (distance >= 500) {
        distance -= 200;
      }

      if (window && window.navigator && window.navigator.vibrate) {
        navigator.vibrate(200);
      }

      context.wait(1, () => {
        const lifes = DB.getLifes();
        context.destroyAll("obstacle");

        if (lifes > 1) {
          DB.setLifes(lifes - 1);
          context.go("game", distance);
        } else {
          context.play("gameover", { volume: 0.8 });
          context.go("lose", distance);
        }
      });
    });

    player.onCollide("coin", (coin) => {
      context.play("coin", { volume: 0.8 });
      distance += 300;
      context.destroy(coin);
    });

    // lose if player collides with any game obj with tag "obstacle"
    player.onCollide("ground", () => {
      if (
        player &&
        !player.isJumping() &&
        !player.isDead &&
        runningAudio.paused === true
      ) {
        player.play("run");
        runningAudio.play();
      }
    });

    const distanceLabel = context.add([
      context.text(distance, {
        font: "VT323",
      }),
      context.pos(24, 24),
    ]);

    context.destroyAll("heart");

    for (let i = 0; i < DB.getLifes(); i++) {
      context.add([
        context.sprite("heart", {
          width: 30,
          height: 30,
        }),
        context.pos(context.width() - 30 - 30 * i, 50),
        context.scale(1),
        context.anchor("center"),
        "heart",
      ]);
    }

    // increment distance every frame
    context.onUpdate(() => {
      const currentLevel = DB.getLevel();
      const playerIsGrounded = player.isGrounded();
      const totalObstacles = context.get("obstacle").length;
      const canUpdateLevel = playerIsGrounded && totalObstacles === 0;

      updateProgress(distance);
      
      if (!player.isDead) {
        distance++;
        distanceLabel.text = distance;
      }

      if (player && player.isJumping() && !player.isDead) {
        runningAudio.paused = true;
      }

      if (distance <= 700 && currentLevel !== GAME_LEVEL.EASY) {
        DB.setLevel(GAME_LEVEL.EASY);
      }

      if (
        distance > 700 &&
        distance <= 2000 &&
        currentLevel !== GAME_LEVEL.MEDIUM &&
        canUpdateLevel
      ) {
        DB.setLevel(GAME_LEVEL.MEDIUM);
      }

      if (
        distance > 2000 &&
        distance <= 4000 &&
        currentLevel !== GAME_LEVEL.HARD &&
        canUpdateLevel
      ) {
        DB.setLevel(GAME_LEVEL.HARD);
      }

      if (
        distance > 4000 &&
        currentLevel !== GAME_LEVEL.EXTREME &&
        canUpdateLevel
      ) {
        DB.setLevel(GAME_LEVEL.EXTREME);
      }

      if (distance > 6000) {
        context.go("lose");
      }

      if (context.get("background")[0]?.pos.x > -400) {
        context.get("background")[0].unuse("move");
      }
    });
  });
}
