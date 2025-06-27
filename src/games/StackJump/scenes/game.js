"use client";

import { KaboomCtx } from "kaboom";
import { GAME_LEVEL, GAME_STATE } from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";
import createObstacle, { createMissObstacle } from "../scripts/obstacle";
import createPlayer from "../scripts/player";
import createProgressBar, { updateProgress } from "../scripts/progress";
import createWorld from "../scripts/world";
import { SETTINGS } from "../settings";

/**
 *
 * @param {KaboomCtx} context
 */
export default function createGameScene(context) {
  let music = context.play("bg", { volume: 0.5, paused: true, loop: true });
  context.scene("game", (lastMaxDistance = 0) => {
    DB.setState(GAME_STATE.RUNNING);

    let lastObstacle = 1;
    const player = createPlayer(context);

    createWorld(context);
    createObstacle(context, player);
    createMissObstacle(context);
    createProgressBar(context);

    if (DB.isMuted()) {
      context.volume(0);
    } else {
      context.volume(1);
    }

    if (music.paused) {
      music.play();
    }

    // verify if player missed platform
    context.onCollideEnd('player', 'obstacleMiss', (player) => {
      const playerCollisions = player.getCollisions();
      if (playerCollisions.length === 1) {
        handlePlayerDeath(context, player, lastObstacle, lastMaxDistance);
      }
    })

    // verify what happens when player collides on platform
    context.onCollide('player', 'obstacle', (player, obstacle, collision) => {
      if (!(collision.isLeft() || collision.isRight() || collision.isTop())) {
        if (player && !player.isJumping() && !player.isDead) {
          player.play("idle");
        }

        // show message
        if (!obstacle.messageTriggered) {
          lastObstacle = obstacle.count;
          if (checkGradeLanding(player, obstacle, 4)) {
            showLandingMessage(context, { text: "PERFEITO", animated: true })
            context.play("perfect", {
              volume: 0.1,
            });
          } else if(checkGradeLanding(player, obstacle, 10)) {
            showLandingMessage(context, { text: "BOM", animated: false })
          }
          obstacle.messageTriggered = true;
        }
        
        // stop platform and create another one
        if (obstacle.createNew === true && !player.isJumping()) {
          obstacle.createNew = false;
          createObstacle(context, player, ++obstacle.count);
          
          // make obstacle static beacause of gravity and checkGradeLanding function
          obstacle.unuse("move");
          obstacle.isStatic = true;
        }
      } else {
        handlePlayerDeath(context, player, lastObstacle, lastMaxDistance);
      }
    });

    // player dies when the platform falls
    context.onCollideEnd('player', 'obstacle', (player, obstacle) => {
      if (!player.isDead && obstacle.opacity < 1) {
        handlePlayerDeath(context, player, lastObstacle, lastMaxDistance);
      }
    })

    player.onCollide('fire', (fire) => {
      context.destroy(player);
      fire.play("death", {
        onEnd: () => {
          context.destroy(fire)
        }
      })
      handlePlayerDeath(context, player, lastObstacle, lastMaxDistance);
    })

    context.destroyAll("heart");

    for (let i = 0; i < DB.getLifes(); i++) {
      context.add([
        context.sprite("heart", {
          width: 30,
          height: 30,
        }),
        context.fixed(),
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

      updateProgress(lastObstacle);
      
      if (lastObstacle <= 15 && currentLevel !== GAME_LEVEL.EASY) {
        DB.setLevel(GAME_LEVEL.EASY);
      }

      if (
        lastObstacle > 15 &&
        lastObstacle <= 25 &&
        currentLevel !== GAME_LEVEL.MEDIUM &&
        playerIsGrounded
      ) {
        DB.setLevel(GAME_LEVEL.MEDIUM);
      }

      if (
        lastObstacle > 25 &&
        lastObstacle <= 30 &&
        currentLevel !== GAME_LEVEL.HARD &&
        playerIsGrounded
      ) {
        DB.setLevel(GAME_LEVEL.HARD);
      }

      if (
        lastObstacle > 30 &&
        currentLevel !== GAME_LEVEL.EXTREME &&
        playerIsGrounded
      ) {
        DB.setLevel(GAME_LEVEL.EXTREME);
      }

      if (lastObstacle == SETTINGS.MAX_NUMBER_PLATFORMS) {
        context.go("lose");
      }
    });
  });
}

/**
 * Handles the player's death and game over logic.
 * 
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {kaboom.GameObj} player - The player object.
 * @param {number} lastObstacle - Current distance travelled.
 * @param {number} lastMaxDistance - Last max distance travelled.
 */
function handlePlayerDeath(context, player, lastObstacle, lastMaxDistance) {
  player.isDead = true;
  player.z = 0
  player.anchor = "center";
  player.play("death");

  const maxDistance = Math.max(lastMaxDistance, lastObstacle);

  context.shake(10);
  context.wait(1.5, () => {
    context.play("gameover", {
      volume: 0.3,
    });
    const lifes = DB.getLifes();
    context.destroyAll("obstacle");
    player.destroy();

    if (lifes > 1) {
      DB.setLifes(lifes - 1);
      context.go("game", maxDistance);
    } else {
      defineLevel(maxDistance);
      context.go("lose", maxDistance);
    }
  });
}

function defineLevel(maxDistance) {
  if (maxDistance <= 25) {
    DB.setLevel(GAME_LEVEL.EASY);
  } else if (maxDistance <= 60) {
    DB.setLevel(GAME_LEVEL.MEDIUM);
  } else if (maxDistance <= 95) {
    DB.setLevel(GAME_LEVEL.HARD);
  } else {
    DB.setLevel(GAME_LEVEL.EXTREME);
  }
}

/**
 * Displays a landing message in a given context.
 * 
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {Object} options - The options for displaying the message.
 * @param {string} options.text - The text to display.
 * @param {boolean} [options.animated=false] - Whether the text should have a wavy animation effect.
 */
function showLandingMessage(context, { text, animated = false }) {
  const message = animated ? `[wavy]${text}[/wavy]` : text
  
  context.destroyAll("landingMessage")
  context.add([
    context.text(message, {
      font: "VT323",
      size: 64,
      styles: {
        "wavy": (idx, ch) => ({
          color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    context.opacity(1),
    context.lifespan(0.7, { fade: 0.2 }),
    context.move(context.UP, 25),
    context.fixed(),
    context.anchor("center"),
    context.pos(context.width() / 2, 100),
    "landingMessage"
  ]);
}

/**
 * Checks if an obstacle is within a specified threshold percentage of a player's horizontal position.
 * 
 * @param {kaboom.GameObj} player - The player object with a position property.
 * @param {kaboom.GameObj} obstacle - The obstacle object with a position property.
 * @param {number} thresholdPercentage - The threshold percentage within which the obstacle is considered "within range" of the player.
 * @returns {boolean} - Returns true if the obstacle is within the threshold range of the player's position, otherwise false.
 */
function checkGradeLanding(player, obstacle, thresholdPercentage) {
    const referenceValue = player.pos.x;
    const value = obstacle.pos.x;
    const margin = (thresholdPercentage / 100) * referenceValue;
    
    // Calculate the lower and upper limits
    const lowerLimit = referenceValue - margin;
    const upperLimit = referenceValue + margin;
    
    // Check if the value is within the range
    return value >= lowerLimit && value <= upperLimit;
}
