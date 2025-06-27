import { KaboomCtx } from "kaboom";

/**
 * Creates a coin sprite in the game context.
 *
 * @param {KaboomCtx} context - The Kaboom game context.
 */
export default function createCar(context) {
  const deviceCenterVerticalPoint = context.height() / 2;
  const deviceCenterHorizontalPoint = context.width() / 2;

  const car = context.add([
    context.sprite("car", { width: context.width() / 4 }),
    context.pos(context.width() / 2, context.height() - 70),
    context.z(2),
    context.anchor("top"),
    { isMoving: false },
    "car",
  ]);

  context.add([
    context.sprite("car_position", { width: context.width() / 4 }),
    context.pos(context.width() / 2, car.pos.y - 10),
    context.opacity(0.7),
    context.z(1),
    context.anchor("center"),
    "background",
  ]);

  car.onUpdate(() => {
    const playerPosition = car.pos.y;
    if (playerPosition < deviceCenterVerticalPoint) {
      context.camPos(deviceCenterHorizontalPoint, playerPosition)
    }
  })

  return car
}

