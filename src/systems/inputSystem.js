// Input System - Handles keyboard input (MANDATORY SYSTEM)
// Functional approach: pure function that takes state and returns new state

import { KEY_MAPPINGS, DIRECTIONS } from '../utils/config.js';

/**
 * Check if direction change is valid (can't reverse into itself)
 * Pure predicate function
 */
const isValidDirectionChange = (currentDir, newDir) => {
  if (!currentDir) return true;
  // Can't go opposite direction
  return !(currentDir.x === -newDir.x && currentDir.y === -newDir.y);
};

/**
 * Create input system
 * Higher-order function that returns the system function
 */
export const createInputSystem = () => {
  let keyQueue = [];

  /**
   * Handle keyboard event
   * Side effect: adds to key queue
   */
  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      keyQueue.push({ type: 'pause' });
      event.preventDefault();
      return;
    }

    const direction = KEY_MAPPINGS[event.code];
    if (direction) {
      keyQueue.push({ type: 'direction', direction });
      event.preventDefault();
    }
  };

  /**
   * Process queued inputs and update world state
   * Pure function (given same inputs, returns same outputs)
   */
  const processInputs = (world) => {
    if (keyQueue.length === 0) return world;

    // Process all queued inputs using reduce
    const newWorld = keyQueue.reduce((currentWorld, input) => {
      if (input.type === 'pause') {
        return {
          ...currentWorld,
          gameStatus: currentWorld.gameStatus === 'playing' ? 'paused' : 'playing'
        };
      }

      if (input.type === 'direction') {
        const currentDirection = currentWorld.inputs.direction;
        const pendingDirection = currentWorld.inputs.pendingDirection || currentDirection;

        if (isValidDirectionChange(pendingDirection, input.direction)) {
          return {
            ...currentWorld,
            inputs: {
              ...currentWorld.inputs,
              pendingDirection: input.direction
            }
          };
        }
      }

      return currentWorld;
    }, world);

    // Clear queue after processing
    keyQueue = [];

    return newWorld;
  };

  // Setup event listener
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  // Return the system function
  return processInputs;
};

/**
 * Apply pending direction change
 * Called at the start of movement to ensure smooth direction changes
 */
export const applyPendingDirection = (world) => {
  if (world.inputs.pendingDirection) {
    return {
      ...world,
      inputs: {
        ...world.inputs,
        direction: world.inputs.pendingDirection,
        pendingDirection: null
      }
    };
  }
  return world;
};
