"use client";

import { KaboomCtx } from "kaboom";
import { GAME_LEVEL, GAME_STATE } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";
import createEnemy from "../scripts/enemy";
import createPlayer from "../scripts/player";
import createWorld from "../scripts/world";
import { SETTINGS } from "../settings";

/**
 *
 * @param {KaboomCtx} context
 */
export default function createGameScene(context) {
  let music = context.play("bg", { volume: 0.5, paused: true });
  context.scene("game", (value) => {
    DB.setState(GAME_STATE.RUNNING);

    let distance = value || 0;
    const player = createPlayer(context);

    createWorld(context);
    createEnemy(context, player);

    if (DB.isMuted()) {
      context.volume(0);
    } else {
      context.volume(1);
    }

    if (music.paused) {
      music.play();
    }

    // lose if player collides with any game obj with tag "enemy"
    player.onCollide("enemy", (enemy) => {
      if (enemy.isDead || player.isDead) {
        return;
      }

      if (window && window.navigator && window.navigator.vibrate) {
        navigator.vibrate(200);
      }

      context.shake(30);
      player.isDead = true;
      player.play("dead");
      player.children.forEach((child) => {
        child.destroy();
      });

      enemy.unuse("circle");
      enemy.use(
        context.sprite("explosion", { anim: "play", width: 50, height: 50 })
      );
      context.play("fireball", { volume: 0.3 });

      context.wait(1, () => {
        context.play("gameover", { volume: 0.8 });
        const lifes = DB.getLifes();
        context.destroyAll("enemy");
        player.destroy();
        enemy.destroy();

        if (lifes > 1) {
          DB.setLifes(lifes - 1);
          context.go("game", distance);
        } else {
          music.stop();
          context.go("lose", distance);
        }
      });
    });

    context.onCollide("bullet", "enemy", (bullet, enemy) => {
      if (enemy.isBullet) {
        return;
      }

      context.destroy(bullet);
      enemy.isDead = true;
      enemy.hurt(1);
    });

    context.on("death", "enemy", (enemy) => {
      if (enemy.isBullet) {
        return;
      }

      enemy.unuse("circle");
      enemy.use(
        context.sprite("explosion", { anim: "play", width: 50, height: 50 })
      );

      context.play("fireball", { volume: 0.2, detune: randi(0, 12) * 100 });
      context.shake(2);

      context.wait(0.5, () => {
        context.destroy(enemy);
      });
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

      if (player.isDead) {
        return;
      }

      distance++;
      distanceLabel.text = distance;

      if (distance <= 1000 && currentLevel !== GAME_LEVEL.EASY) {
        DB.setLevel(GAME_LEVEL.EASY);
      }

      if (
        distance > 1000 &&
        distance <= 2000 &&
        currentLevel !== GAME_LEVEL.MEDIUM
      ) {
        DB.setLevel(GAME_LEVEL.MEDIUM);
      }

      if (
        distance > 2000 &&
        distance <= 4000 &&
        currentLevel !== GAME_LEVEL.HARD
      ) {
        DB.setLevel(GAME_LEVEL.HARD);
      }

      if (distance > 4000 && currentLevel !== GAME_LEVEL.EXTREME) {
        DB.setLevel(GAME_LEVEL.EXTREME);
      }

      if (distance > 5500) {
        context.go("lose");
      }

      if (context.get("background")[0]?.pos.y > -400) {
        context.get("background")[0].unuse("move");
      }
    });
  });
}
