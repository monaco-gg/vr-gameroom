/**
 * @fileoverview Module to create and update a progress bar in a Kaboom.js context.
 * @module ProgressBar
 */

import { SETTINGS } from "../settings";

const margin = 20;
const barHeight = 40;
let progressBar, progressCircle;

/**
 * Creates a progress bar in the provided context.
 * 
 * @param {object} context - The Kaboom.js context where the progress bar will be created.
 */
export default function createProgressBar(context) {
  
  const barWidth = context.width() - 2 * margin;
  const barX = margin;
  const barY = barHeight + 40;

  // Create the progress bar rectangle
  progressBar = context.add([
    context.rect(barWidth, barHeight),
    context.pos(barX, barY),
    context.fixed(),
    context.color(109, 74, 255),
    context.outline(3, context.rgb(50, 23, 162)),
    context.opacity(0.6),
  ]);

  // Create the circle that represents progress
  progressCircle = context.add([
    context.circle(7),
    context.pos(barX, barY + barHeight / 2),
    context.fixed(),
    context.anchor("center"),
    context.color(50, 23, 162),
  ]);
}

/**
 * Updates the position of the progress circle based on the provided distance.
 * 
 * @param {number} distance - The current distance traveled, used to calculate the progress.
 */
export function updateProgress (distance) {
  const barWidth = width() - 2 * margin;
  const barX = margin;
  const progress = Math.min(distance / SETTINGS.MAX_NUMBER_PLATFORMS, 1);

  progressCircle.pos.x = barX + progress * barWidth;
}