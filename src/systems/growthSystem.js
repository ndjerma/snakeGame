// Growth System - Handles snake growth and food spawning (CUSTOM SYSTEM 3)
// Demonstrates: map, filter, immutable array operations

import { ComponentType, createPosition, createFood, createRenderable, createSnakeSegment } from '../components/components.js';
import { createEntity, addComponent, removeEntity, getComponent } from '../core/ecs.js';
import { CONFIG } from '../utils/config.js';

/**
 * Get all occupied positions on the grid
 * Uses map to extract positions
 */
const getOccupiedPositions = (world) => {
  return world.snakeBody
    .map(entityId => getComponent(world, entityId, ComponentType.POSITION))
    .filter(pos => pos !== undefined);
};

/**
 * Get all empty positions on the grid
 * Uses filter to find available positions
 */
const getEmptyPositions = (world) => {
  const occupiedPositions = getOccupiedPositions(world);
  const allPositions = [];

  // Generate all possible positions
  for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
    for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
      allPositions.push({ x, y });
    }
  }

  // Filter out occupied positions
  return allPositions.filter(pos =>
    !occupiedPositions.some(occupied =>
      occupied.x === pos.x && occupied.y === pos.y
    )
  );
};

/**
 * Spawn food at random empty position
 * Returns new world with food entity
 */
const spawnFood = (world) => {
  const emptyPositions = getEmptyPositions(world);
  if (emptyPositions.length === 0) return world;

  // Random position
  const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];

  // Create food entity
  let [newWorld, foodId] = createEntity(world);
  newWorld = addComponent(newWorld, foodId, ComponentType.POSITION, createPosition(randomPos.x, randomPos.y));
  newWorld = addComponent(newWorld, foodId, ComponentType.FOOD, createFood(CONFIG.FOOD_VALUE));
  newWorld = addComponent(newWorld, foodId, ComponentType.RENDERABLE, createRenderable(CONFIG.COLORS.FOOD));

  return newWorld;
};

/**
 * Add segment to snake tail
 * Returns new world with added segment
 */
const growSnake = (world) => {
  if (world.snakeBody.length === 0) return world;

  // Get tail position
  const tailId = world.snakeBody[world.snakeBody.length - 1];
  const tailPosition = getComponent(world, tailId, ComponentType.POSITION);
  if (!tailPosition) return world;

  // Create new segment at tail position (it will move on next update)
  let [newWorld, segmentId] = createEntity(world);
  newWorld = addComponent(newWorld, segmentId, ComponentType.POSITION, createPosition(tailPosition.x, tailPosition.y));
  newWorld = addComponent(newWorld, segmentId, ComponentType.SNAKE_SEGMENT, createSnakeSegment(world.snakeBody.length));
  newWorld = addComponent(newWorld, segmentId, ComponentType.RENDERABLE, createRenderable(CONFIG.COLORS.SNAKE_BODY));

  // Add to snake body array (immutable concatenation)
  return {
    ...newWorld,
    snakeBody: [...newWorld.snakeBody, segmentId]
  };
};

/**
 * Growth System
 * Handles food consumption and snake growth
 * Pure function - returns new world state
 */
export const growthSystem = (world) => {
  if (world.gameStatus !== 'playing') return world;

  // Check if food was eaten
  if (world.collidedFood) {
    let newWorld = world;

    // Remove eaten food
    newWorld = removeEntity(newWorld, world.collidedFood);

    // Grow snake
    newWorld = growSnake(newWorld);

    // Spawn new food
    newWorld = spawnFood(newWorld);

    // Clear collision flag
    return {
      ...newWorld,
      collidedFood: null
    };
  }

  return world;
};

/**
 * Initialize food system - spawn initial food
 */
export const initializeFood = (world) => {
  return spawnFood(world);
};
