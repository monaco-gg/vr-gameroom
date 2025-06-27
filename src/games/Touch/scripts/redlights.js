import { KaboomCtx } from "kaboom";
import { SETTINGS } from "../settings";

/**
 * TODO: Remove (or isolate) LEVEL logic.
 *
 * Dynamically generates obstacles in the game at random intervals and positions.
 * If the player is not dead, an obstacle is created and automatically moves across the screen.
 * New obstacles are generated recursively at random intervals.
 *
 * @param {KaboomCtx} context - The Kaboom context used for game object manipulation.
 * @param {object} player - The player object to check if the player is still alive.
 */
export default function createRedLights(context, trafficLightCounter = 1) {
  if (trafficLightCounter > SETTINGS.NUMBER_TRAFFIC_LIGHTS) return;
  
  // Initial delay before creating an obstacle
  context.wait(1, () => {
    const playerSize =
      (context.width() - SETTINGS.TRAFFIC_LIGHT_MARGIN * (SETTINGS.NUMBER_TRAFFIC_LIGHTS + 1)) /
      SETTINGS.NUMBER_TRAFFIC_LIGHTS;
    
    context.add([
      context.circle(playerSize / 2, playerSize / 2),
      context.color(255, 0, 0),
      context.pos(
        trafficLightCounter * (playerSize + SETTINGS.TRAFFIC_LIGHT_MARGIN / 1.05),
        context.height() / 2 + playerSize / 2
      ),
      context.scale(1),
      context.anchor("right"),
      context.area({
        shape: new context.Rect(context.vec2(0), 1, 1),
        offset: context.vec2(1, 1),
      }),
      context.body(),
      context.z(4),
      "redLight",
      { falseStart: false, triggered: false }
    ]);
    context.play('red_light', { speed: 2.5, volume: 0.1 });

    // Recursively create another red light
    context.wait(context.rand(0.5), () => {
      createRedLights(context, ++trafficLightCounter);
    });
  });
}
