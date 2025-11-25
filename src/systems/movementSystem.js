// Movement System - Moves snake based on direction (CUSTOM SYSTEM 1)
// Demonstrates: map, reduce, immutability

import { ComponentType } from '../components/components.js';
import { getComponent, updateComponent, queryEntities } from '../core/ecs.js';
import { applyPendingDirection } from './inputSystem.js';

/**
 * Calculate new position based on current position and direction
 * Pure function
 */
const calculateNewPosition = (position, direction) => ({
  x: position.x + direction.x,
  y: position.y + direction.y
});

/**
 * Movement System
 * Moves snake head and body segments
 * Pure function - returns new world state
 */
export const movementSystem = (world) => {
  if (world.gameStatus !== 'playing') return world;

  // Apply any pending direction change
  const worldWithDirection = applyPendingDirection(world);

  const direction = worldWithDirection.inputs.direction;
  if (!direction) return worldWithDirection;

  // Get snake head
  const [headId] = worldWithDirection.snakeBody;
  if (!headId) return worldWithDirection;

  const headPosition = getComponent(worldWithDirection, headId, ComponentType.POSITION);
  if (!headPosition) return worldWithDirection;

  // Calculate new head position
  const newHeadPosition = calculateNewPosition(headPosition, direction);

  // Store old positions for body segments to follow
  // Using map to transform snakeBody array into positions (immutable)
  const oldPositions = worldWithDirection.snakeBody.map(entityId =>
    getComponent(worldWithDirection, entityId, ComponentType.POSITION)
  );

  // Update head position
  let newWorld = updateComponent(
    worldWithDirection,
    headId,
    ComponentType.POSITION,
    newHeadPosition
  );

  // Update body segments - each segment moves to previous segment's position
  // Using reduce to thread state through updates (demonstrates reduce)
  newWorld = worldWithDirection.snakeBody.slice(1).reduce((currentWorld, entityId, index) => {
    const previousPosition = oldPositions[index]; // Position of segment ahead
    return updateComponent(
      currentWorld,
      entityId,
      ComponentType.POSITION,
      previousPosition
    );
  }, newWorld);

  return newWorld;
};
