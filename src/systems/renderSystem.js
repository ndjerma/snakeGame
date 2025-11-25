// Render System - Draws entities to canvas (MANDATORY SYSTEM)
// Demonstrates: map for iterating entities, side effects in controlled manner

import { ComponentType } from '../components/components.js';
import { getComponent, getAllComponents } from '../core/ecs.js';
import { CONFIG } from '../utils/config.js';

/**
 * Clear canvas
 * Side effect: modifies canvas
 */
const clearCanvas = (ctx) => {
  ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
  ctx.fillRect(0, 0, CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE, CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE);
};

/**
 * Draw grid lines
 * Side effect: draws on canvas
 */
const drawGrid = (ctx) => {
  ctx.strokeStyle = CONFIG.COLORS.GRID;
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CONFIG.CELL_SIZE, 0);
    ctx.lineTo(x * CONFIG.CELL_SIZE, CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CONFIG.CELL_SIZE);
    ctx.lineTo(CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE, y * CONFIG.CELL_SIZE);
    ctx.stroke();
  }
};

/**
 * Draw a single entity
 * Pure logic, side effect in drawing
 */
const drawEntity = (ctx, position, renderable) => {
  if (!position || !renderable) return;

  const x = position.x * CONFIG.CELL_SIZE;
  const y = position.y * CONFIG.CELL_SIZE;
  const size = CONFIG.CELL_SIZE * (renderable.size || 1);
  const padding = 2;

  ctx.fillStyle = renderable.color;

  if (renderable.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(
      x + CONFIG.CELL_SIZE / 2,
      y + CONFIG.CELL_SIZE / 2,
      (size / 2) - padding,
      0,
      Math.PI * 2
    );
    ctx.fill();
  } else {
    // Default rectangle
    ctx.fillRect(
      x + padding,
      y + padding,
      size - padding * 2,
      size - padding * 2
    );
  }
};

/**
 * Draw all renderable entities
 * Uses map to iterate over entities
 */
const drawEntities = (ctx, world) => {
  const renderables = getAllComponents(world, ComponentType.RENDERABLE);

  // Use map to process each renderable entity
  // (we use forEach here for side effects, but we could use map and discard results)
  Array.from(renderables.keys()).forEach(entityId => {
    const position = getComponent(world, entityId, ComponentType.POSITION);
    const renderable = getComponent(world, entityId, ComponentType.RENDERABLE);
    drawEntity(ctx, position, renderable);
  });
};

/**
 * Draw score and UI
 */
const drawUI = (ctx, world) => {
  ctx.fillStyle = CONFIG.COLORS.TEXT;
  ctx.font = '16px monospace';

  const uiY = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE + 20;

  ctx.fillText(`Score: ${world.score}`, 10, uiY);
  ctx.fillText(`Length: ${world.snakeBody.length}`, 150, uiY);

  if (world.gameStatus === 'paused') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE, CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE);

    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2, (CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE) / 2);
    ctx.textAlign = 'left';
  }

  if (world.gameStatus === 'gameOver') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE, CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE);

    ctx.fillStyle = CONFIG.COLORS.TEXT;
    ctx.font = '32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2, (CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE) / 2 - 20);
    ctx.font = '20px monospace';
    ctx.fillText(`Final Score: ${world.score}`, (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2, (CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE) / 2 + 20);
    ctx.font = '16px monospace';
    ctx.fillText('Press F5 to restart', (CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE) / 2, (CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE) / 2 + 50);
    ctx.textAlign = 'left';
  }
};

/**
 * Create render system
 * Higher-order function that returns the system function
 */
export const createRenderSystem = (canvas) => {
  const ctx = canvas.getContext('2d');

  /**
   * Render system function
   * Takes world state and draws it
   * This is a "system" that causes side effects (drawing)
   */
  return (world) => {
    clearCanvas(ctx);
    drawGrid(ctx);
    drawEntities(ctx, world);
    drawUI(ctx, world);

    return world; // Return world unchanged (rendering doesn't modify state)
  };
};
