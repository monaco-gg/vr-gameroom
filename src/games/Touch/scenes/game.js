"use client";

import { KaboomCtx } from "kaboom";
import {
  GAME_DEFAULT,
  GAME_LEVEL,
  GAME_STATE,
} from "../../../app/contexts/EngineContext";
import { DB } from "../../../app/utils/storage";
import createCar from "../scripts/car";
import createPlayer from "../scripts/player";
import createRedLights from "../scripts/redlights";
import createWorld from "../scripts/world";

/**
 *
 * @param {KaboomCtx} context
 */
export default function createGameScene(context) {
  context.scene("game", (timeRecords) => {
    DB.setState(GAME_STATE.RUNNING);

    const laps = timeRecords || ["---", "---", "---"];
    const speedLines = [];
    const soundCarStopped = context.play("motor_loop", {
      loop: true,
      volume: 0.5,
    });
    const soundCarMoving = context.play("car", { paused: true, volume: 0.3 });
    const soundFalseStart = context.play("false_start", {
      paused: true,
      volume: 0.3,
    });

    let player = null;

    createWorld(context);
    createRedLights(context);
    const car = createCar(context);

    context.wait(context.rand(8, 12), () => (player = createPlayer(context)));

    updateScoreBoard(context, laps);

    if (DB.isMuted()) {
      context.volume(0);
    } else {
      context.volume(1);
    }

    context.destroyAll("heart");

    for (let i = 0; i < DB.getLifes(); i++) {
      context.add([
        context.sprite("heart", {
          width: 30,
          height: 30,
        }),
        context.pos(context.width() - 30 - 30 * i, 50),
        context.fixed(),
        context.anchor("center"),
        "heart",
      ]);
    }

    context.onUpdate(() => {
      const firstRedLight = context.get("redLight")[3];
      if (
        firstRedLight &&
        firstRedLight?.falseStart &&
        !firstRedLight?.triggered
      ) {
        firstRedLight.triggered = true;
        soundFalseStart.paused = false;
        showMessage(context, { text: "Queimou a Largada" });
        context.wait(2, () => {
          handleDeath(context, laps);
          soundCarStopped.paused = true;
          soundCarMoving.paused = true;
        });
      }

      if ((player && player?.touchedAt !== null) || firstRedLight?.triggered) {
        if (!car.isMoving) {
          soundCarMoving.paused = false;
          car.isMoving = true;
          updateScoreBoard(context, laps, player?.touchedAt || 999);
          context.wait(7, () => {
            handleDeath(context, laps);
            soundCarStopped.paused = true;
            soundCarMoving.paused = true;
          });
        } else {
          car.move(0, -800);
          context.wait(1, () => {
            if (context.rand(0, 1) > 0.8) {
              speedLines.push(createSpeedLine(context, car));
            }
          });
        }
      }
    });
  });
}

function defineLevel(laps) {
  // const minLapValue = Math.min(...laps);

  let total = 0;
  for (let lap of laps) {
    total += lap;
  }
  let avg = total / laps.length;
  avg = Number(avg.toFixed(2));

  if (avg <= 190) {
    DB.setLevel(GAME_LEVEL.EXTREME);
  } else if (avg <= 210) {
    DB.setLevel(GAME_LEVEL.HARD);
  } else if (avg <= 240) {
    DB.setLevel(GAME_LEVEL.MEDIUM);
  } else {
    DB.setLevel(GAME_LEVEL.EASY);
  }

  return avg;
}

function updateScoreBoard(context, laps, lapTime = "---") {
  const lapElements = [];

  context.destroyAll("scoreboard");
  context.destroyAll("currentLap");
  laps[GAME_DEFAULT.LIFES - DB.getLifes()] = lapTime;

  const minLapValue = Math.min(
    ...laps.filter((item) => Number.isInteger(item))
  );

  laps.map((lap, i) => {
    const color = lap == minLapValue ? [255, 226, 0] : [255, 255, 255];
    lapElements.push(
      context.add([
        context.text(`${lap} ms`, {
          font: "VT323",
        }),
        context.color(...color),
        context.fixed(),
        context.pos(30, ++i * 24),
        "scoreboard",
      ])
    );
  });

  context.add([
    context.text(`${lapTime} ms`, {
      font: "VT323",
    }),
    context.fixed(),
    context.anchor("center"),
    context.pos(context.width() / 2, context.height() / 2.3),
    "currentLap",
  ]);
}

function handleDeath(context, laps) {
  const lifes = DB.getLifes();
  if (lifes > 1) {
    DB.setLifes(lifes - 1);
    context.go("game", laps);
  } else {
    const avg = defineLevel(laps);
    context.go("lose", { laps, avg });
  }
}

/**
 * Displays a message in a given context.
 *
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {Object} options - The options for displaying the message.
 * @param {string} options.text - The text to display.
 * @param {boolean} [options.animated=false] - Whether the text should have a wavy animation effect.
 */
function showMessage(context, { text, animated = false }) {
  const message = animated ? `[wavy]${text}[/wavy]` : text;

  context.destroyAll("falseStartMessage");
  context.add([
    context.text(message, {
      font: "VT323",
      size: 32,
      styles: {
        wavy: (idx, ch) => ({
          color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    context.opacity(1),
    context.lifespan(2, { fade: 0.2 }),
    context.move(context.UP, 70),
    context.fixed(),
    context.z(7),
    context.anchor("center"),
    context.pos(context.width() / 2, context.height()),
    "falseStartMessage",
  ]);
}

function createSpeedLine(context, car) {
  const speedline = add([
    context.sprite("speedline", { width: 5, height: context.rand(20, 60) }),
    context.pos(context.rand(0, width()), car.pos.y + context.rand(-600, -700)),
    context.color(255, 255, 255),
    context.z(4),
    context.opacity(context.rand(0.3, 0.8)),
    "speedLine",
  ]);

  onUpdate("speedLine", (line) => {
    line.move(0, 150);
    if (line.pos.y > context.height()) {
      context.destroy(line);
    }
  });

  return speedline;
}
