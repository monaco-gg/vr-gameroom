import { KaboomCtx } from "kaboom";
import { GAME_LEVEL } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";
import { SETTINGS } from "../settings";

const getSpeedIncrement = () => {
  switch (DB.getLevel()) {
    case GAME_LEVEL.EASY:
      return 10;
    case GAME_LEVEL.MEDIUM:
      return 30;
    case GAME_LEVEL.HARD:
      return 50;
    case GAME_LEVEL.EXTREME:
      return 100;
    default:
      return 10;
  }
};

/**
 * TODO: Remove (or isolate) LEVEL logic.
 *
 * Dynamically generates enemies in the game at random intervals and positions.
 * If the player is not dead, an enemy is created and automatically moves across the screen.
 * New enemies are generated recursively at random intervals.
 *
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {object} player - The player object to check if the player is still alive.
 */
export default function createEnemy(context, player) {
  // Initial delay before creating an enemy

  let waitTime = 1.3;
  let isHard = DB.getLevel() === GAME_LEVEL.HARD;

  switch (DB.getLevel()) {
    case GAME_LEVEL.EASY:
      waitTime = 1.3;
    case GAME_LEVEL.MEDIUM:
      waitTime = 0.9;
    case GAME_LEVEL.HARD:
      waitTime = 0.8;
    case GAME_LEVEL.EXTREME:
      waitTime = 0.5;
  }

  const enemyAttack = (enemyId, enemy) => {
    if (enemy.isDead) {
      return;
    }

    const dir = player.pos.sub(enemy.pos).unit();
    let color = context.GREEN;

    switch (enemyId) {
      case 1:
        color = context.GREEN;
        break;
      case 2:
        color = context.RED;
        break;
      case 3:
        color = context.YELLOW;
        break;
    }

    // ENEMY ATTACK
    context.add([
      context.circle(5),
      context.area(),
      context.body({ mass: 1 }),
      context.pos(enemy.pos.x + 30, enemy.pos.y + 20),
      context.offscreen({ destroy: true }),
      context.anchor("center"),
      context.health(1),
      context.color(color),
      context.move(dir, SETTINGS.ENEMY_BULLET_SPEED),
      { isBullet: true, isDead: false },
      "enemy",
    ]);
    context.play("shoot", { volume: 0.15, detune: randi(0, 12) * 100 });
  };

  context.wait(waitTime, () => {
    if (!player.isDead) {
      const enemyId = parseInt(context.rand(1, 4));
      const spriteEnemy = context.sprite(`enemy${enemyId}`, {
        width: 60,
        height: 60,
      });

      // custom spin component
      function spin() {
        return {
          id: "spin",
          update() {
            if (this.isDead === false) {
              let rotate = this.angle;
              //this.scale = Math.sin(context.time() + 0) * 1;
              if (rotate > 180) {
                rotate = 0;
              }
              this.angle += 10;
            }
          },
        };
      }

      // Adds an enemy with various properties
      const enemy = context.add([
        spriteEnemy,
        context.area({
          shape: new context.Rect(context.vec2(0), 50, 50),
          // offset: context.vec2(50, 34),
        }),
        context.body({ mass: 1 }),
        context.pos(rand(0, width()), -40),
        context.anchor("center"),
        context.health(1),
        context.rotate(0),
        context.move(context.DOWN, 0),
        { isDead: false, totalAttacks: 3 },
        context.offscreen({ destroy: true }),
        context.state("idle", ["idle", "attack", "move"]),
        "enemy",
      ]);

      if (enemyId === 3) {
        enemy.use(spin());
      }

      enemy.onStateEnter("idle", async () => {
        await context.wait(0.5);
        enemy.enterState("attack");
      });

      enemy.onStateEnter("attack", async () => {
        if (!player.exists()) {
          return;
        }

        if (
          enemy.totalAttacks > 0 &&
          enemy.isDead === false &&
          DB.getLevel() !== GAME_LEVEL.EASY
        ) {
          enemyAttack(enemyId, enemy);
          enemy.totalAttacks -= 1;
        }

        await context.wait(0.2);
        enemy.enterState("move");
      });

      if (isHard) {
        enemy.onStateEnter("move", async () => {
          if (enemy.totalAttacks > 0 && enemy.isDead === false) {
            await context.wait(0.4);
            enemyAttack(enemyId, enemy);
            enemy.totalAttacks -= 1;
          }
        });
      }

      // Like .onUpdate() which runs every frame, but only runs when the current state is "move"
      // Here we move towards the player every frame if the current state is "move"
      enemy.onStateUpdate("move", async () => {
        if (!player.exists() || enemy.isDead) {
          return;
        }

        const dir = player.pos.sub(enemy.pos).unit();
        enemy.move(dir.scale(SETTINGS.ENEMY_SPEED + getSpeedIncrement()));
      });

      // Taking a bullet makes us disappear
      // player.onCollide("bulletEnemy", (bullet) => {
      //   destroy(bullet);
      //   destroy(player);
      // });
    }

    // Recursively create another enemy after a random delay

    let waitTime = 2;

    switch (DB.getLevel()) {
      case GAME_LEVEL.EASY:
        waitTime = 2;
      case GAME_LEVEL.MEDIUM:
        waitTime = 1.5;
      case GAME_LEVEL.HARD:
        waitTime = 1.2;
      case GAME_LEVEL.EXTREME:
        waitTime = 1.1;
    }

    context.wait(context.rand(1, waitTime), () => {
      createEnemy(context, player);
    });
  });
}
