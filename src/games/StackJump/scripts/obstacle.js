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
 * @param {number} [count=1] - Platform counter.
 * @param {number} [repeat=1] - Platform miss counter.
 */
export default function createObstacle(context, player, count = 1, repeat = 1) {
  context.wait(1, () => {
    if (!player.isDead) {
      const randomDirection = Math.round(Math.random());
      const obstacleWidthSize = 125;

      const platformMoves = [{
        direction: context.LEFT,
        startPosition: context.width() + obstacleWidthSize - 10
      }, {
        direction: context.RIGHT,
        startPosition: -obstacleWidthSize + 10
      }]

      // Platform
      const obstacle = context.add([
        context.sprite("platform", { width: obstacleWidthSize, height: SETTINGS.PLATFORM_HEIGHT }),
        context.area({
          shape: new context.Rect(context.vec2(0), obstacleWidthSize, 1)
        }),
        context.body({ gravityScale: 0 }),
        context.z(2),
        context.scale(1),
        context.opacity(1),
        context.pos(
          platformMoves[randomDirection].startPosition,
          context.height() - SETTINGS.FLOOR_HEIGHT - (count * SETTINGS.PLATFORM_HEIGHT)
        ),
        context.anchor("bot"),
        context.move(platformMoves[randomDirection].direction, SETTINGS.SPEED + getSpeedIncrement()),
        context.offscreen({ destroy: true }),
        "obstacle",
        {
          dir: platformMoves[randomDirection].direction,
          messageTriggered: false,
          createNew: true,
          deathTimer: 0,
          count
        },
        destroyObstacle(context, count)
      ]);

      // trigger fire when user is moscando
      if (repeat === 5) {
        createFlyingObstacle(context, count);
      }

      obstacle.onDestroy(() => {
        // prevent be triggered by first first one platforms destroy events
        if (obstacle.count <= count) {
          createObstacle(context, player, count, ++repeat);
        }
      })

      // move object that detects player miss jump
      const platformMiss = context.get("obstacleMiss")[0];
      platformMiss.moveTo(platformMiss.pos.x, obstacle.pos.y);

      return obstacle;
    }
  });
}

function destroyObstacle(context, count) {
  const NUMBER_SOLID_OBSTACLES = 1;
  let timer = 13;
  
  return {
    id: `obstacle${count}`,
    update() {
      timer -= dt();
      if (timer <= 0 && this.opacity > 0 && count > NUMBER_SOLID_OBSTACLES) {
        const duration = 1;
        const animation = Math.max(0, 1 * (1 - this.deathTimer / duration));

        this.deathTimer += dt();
        this.scale = context.vec2(animation, animation);
        this.opacity = animation;
      }
      if (timer <= 0 && this.opacity <= 0) {
        this.destroy();
      }
    }
  }
}

/**
 * Function to create a "miss" obstacle platform collider when player miss the platform and dies.
 * 
 * @param {Object} context - The game context provided by the Kaboom.js library.
 */
export function createMissObstacle(context) {
  // Platform miss collider
  const missObstacle = context.add([
    context.rect(context.width(), SETTINGS.PLATFORM_HEIGHT),
    context.area(),
    context.area({
      shape: new context.Rect(context.vec2(0), 30, SETTINGS.PLATFORM_HEIGHT),
      offset: context.vec2(0),
    }),
    context.pos(
      context.width() / 2,
      context.height() - SETTINGS.FLOOR_HEIGHT - (1 * SETTINGS.PLATFORM_HEIGHT)
    ),
    context.opacity(0),
    context.anchor("bot"),
    "obstacleMiss",
  ]);
}

/**
 * Creates a flying obstacle.
 *
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {number} count - Counter for the number of obstacles created.
 */
function createFlyingObstacle(context, count) {
  const obstacleSize = 130;
  const obstacleShapeSize = 30;
  const alertSize = 60;
  
  // Alert Symbol
  context.play("alert", { volume: 0.2 });
  context.add([
    context.sprite("alert", { width: alertSize, height: alertSize }),
    context.pos(
      context.width() - alertSize,
      (context.height() - SETTINGS.FLOOR_HEIGHT) - ((count * SETTINGS.PLATFORM_HEIGHT) - SETTINGS.PLATFORM_HEIGHT / 2) - (alertSize * 2)
    ),
    context.scale(1),
    context.anchor("center"),
    "alert",
  ]);

  // Fire
  context.add([
    context.sprite(`fire`, { anim: "run", flipX: true, width: obstacleSize, height: obstacleSize }),
    context.area({ 
      collisionIgnore: ["obstacleMiss", "obstacle", "ground"],
      shape: new context.Rect(context.vec2(0), obstacleShapeSize, obstacleShapeSize),
    }),
    context.body({ gravityScale: 0 }),
    context.anchor("center"),
    context.z(4),
    context.pos(
      (context.width() + obstacleSize) - 10,
      context.height() - SETTINGS.FLOOR_HEIGHT - (count * SETTINGS.PLATFORM_HEIGHT) + (obstacleShapeSize / 2)
    ),
    context.move(context.LEFT, SETTINGS.SPEED + getSpeedIncrement() * 0.7),
    context.offscreen({ destroy: true }),
    "fire",
  ]);
}
