// Game loop and state management
// Demonstrates function composition for update pipeline

import { pipe } from '../utils/functional.js';
import { CONFIG } from '../utils/config.js';

/**
 * Create game loop with fixed timestep
 * Higher-order function that takes systems and returns game loop
 */
export const createGameLoop = (updateSystems, renderSystem) => {
  let lastUpdateTime = 0;
  const updateInterval = 1000 / CONFIG.INITIAL_SPEED; // milliseconds per update
  let world = null;
  let animationId = null;

  /**
   * Compose all update systems into single update function
   * This demonstrates function composition - a key FP concept
   */
  const updatePipeline = pipe(...updateSystems);

  /**
   * Game loop tick
   */
  const tick = (currentTime) => {
    if (!world) return;

    const deltaTime = currentTime - lastUpdateTime;

    // Fixed timestep update
    if (deltaTime >= updateInterval) {
      // Update game state through composed pipeline
      world = updatePipeline(world);
      lastUpdateTime = currentTime;
    }

    // Render every frame
    renderSystem(world);

    // Continue loop
    animationId = requestAnimationFrame(tick);
  };

  /**
   * Start the game loop
   */
  const start = (initialWorld) => {
    world = initialWorld;
    lastUpdateTime = performance.now();
    animationId = requestAnimationFrame(tick);
  };

  /**
   * Stop the game loop
   */
  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  /**
   * Get current world state
   */
  const getWorld = () => world;

  /**
   * Set world state (useful for debugging)
   */
  const setWorld = (newWorld) => {
    world = newWorld;
  };

  return {
    start,
    stop,
    getWorld,
    setWorld
  };
};
