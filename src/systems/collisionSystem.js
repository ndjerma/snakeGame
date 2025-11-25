// Collision System - Detects collisions (CUSTOM SYSTEM 2)
// Demonstrates: filter, predicate functions, function composition

import { ComponentType } from '../components/components.js';
import { getComponent } from '../core/ecs.js';
import { CONFIG } from '../utils/config.js';

/**
 * Check if position is out of bounds
 * Pure predicate function
 */
const isOutOfBounds = (position) =>
  position.x < 0 ||
  position.x >= CONFIG.GRID_WIDTH ||
  position.y < 0 ||
  position.y >= CONFIG.GRID_HEIGHT;

/**
 * Check if two positions are equal
 * Pure predicate function
 */
const positionsEqual = (pos1, pos2) =>
  pos1.x === pos2.x && pos1.y === pos2.y;

/**
 * Check if head collides with body
 * Uses filter to find matching positions
 */
const collidesWithSelf = (world, headPosition) => {
  const bodyPositions = world.snakeBody
    .slice(1) // Skip head
    .map(entityId => getComponent(world, entityId, ComponentType.POSITION))
    .filter(pos => pos !== undefined);

  // Use some to check if any body position matches head
  return bodyPositions.some(bodyPos => positionsEqual(headPosition, bodyPos));
};

/**
 * Check if head collides with food
 * Returns food entity ID or null
 */
const checkFoodCollision = (world, headPosition) => {
  const foodComponents = world.components.get(ComponentType.FOOD);
  if (!foodComponents) return null;

  // Use filter to find food at head position
  const collidedFood = Array.from(foodComponents.keys()).filter(entityId => {
    const foodPos = getComponent(world, entityId, ComponentType.POSITION);
    return foodPos && positionsEqual(headPosition, foodPos);
  });

  return collidedFood[0] || null;
};

/**
 * Collision System
 * Checks for all collision types and updates game state
 * Pure function - returns new world state
 */
export const collisionSystem = (world) => {
  if (world.gameStatus !== 'playing') return world;

  const [headId] = world.snakeBody;
  if (!headId) return world;

  const headPosition = getComponent(world, headId, ComponentType.POSITION);
  if (!headPosition) return world;

  // Check wall collision
  if (isOutOfBounds(headPosition)) {
    return {
      ...world,
      gameStatus: 'gameOver'
    };
  }

  // Check self collision
  if (collidesWithSelf(world, headPosition)) {
    return {
      ...world,
      gameStatus: 'gameOver'
    };
  }

  // Check food collision
  const foodId = checkFoodCollision(world, headPosition);
  if (foodId) {
    const foodData = getComponent(world, foodId, ComponentType.FOOD);
    return {
      ...world,
      collidedFood: foodId,
      score: world.score + (foodData?.value || 0)
    };
  }

  return world;
};
