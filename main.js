// Main entry point - Game initialization
// This file sets up the initial game state and starts the game loop

import { createWorld, createEntity, addComponent } from './src/core/ecs.js';
import { createGameLoop } from './src/core/game.js';
import {
  ComponentType,
  createPosition,
  createDirection,
  createSnakeHead,
  createSnakeSegment,
  createRenderable
} from './src/components/components.js';
import { CONFIG, DIRECTIONS } from './src/utils/config.js';
import { createInputSystem } from './src/systems/inputSystem.js';
import { movementSystem } from './src/systems/movementSystem.js';
import { collisionSystem } from './src/systems/collisionSystem.js';
import { growthSystem, initializeFood } from './src/systems/growthSystem.js';
import { createRenderSystem } from './src/systems/renderSystem.js';

/**
 * Initialize snake with starting segments
 * Returns [world, snakeBody array]
 */
const initializeSnake = (world) => {
  const startX = Math.floor(CONFIG.GRID_WIDTH / 2);
  const startY = Math.floor(CONFIG.GRID_HEIGHT / 2);
  const snakeBody = [];

  let currentWorld = world;

  // Create head
  let [newWorld, headId] = createEntity(currentWorld);
  currentWorld = newWorld;
  currentWorld = addComponent(currentWorld, headId, ComponentType.POSITION, createPosition(startX, startY));
  currentWorld = addComponent(currentWorld, headId, ComponentType.SNAKE_HEAD, createSnakeHead());
  currentWorld = addComponent(currentWorld, headId, ComponentType.RENDERABLE, createRenderable(CONFIG.COLORS.SNAKE_HEAD));
  snakeBody.push(headId);

  // Create initial body segments
  for (let i = 1; i < CONFIG.INITIAL_LENGTH; i++) {
    let [world2, segmentId] = createEntity(currentWorld);
    currentWorld = world2;
    currentWorld = addComponent(currentWorld, segmentId, ComponentType.POSITION, createPosition(startX - i, startY));
    currentWorld = addComponent(currentWorld, segmentId, ComponentType.SNAKE_SEGMENT, createSnakeSegment(i));
    currentWorld = addComponent(currentWorld, segmentId, ComponentType.RENDERABLE, createRenderable(CONFIG.COLORS.SNAKE_BODY));
    snakeBody.push(segmentId);
  }

  return [currentWorld, snakeBody];
};

/**
 * Initialize game world
 */
const initializeGame = (canvas) => {
  // Create empty world
  let world = createWorld();

  // Initialize snake
  const [worldWithSnake, snakeBody] = initializeSnake(world);
  world = {
    ...worldWithSnake,
    snakeBody,
    inputs: {
      direction: DIRECTIONS.RIGHT,
      pendingDirection: null
    }
  };

  // Spawn initial food
  world = initializeFood(world);

  return world;
};

/**
 * Main game setup
 */
const main = () => {
  // Get canvas
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Set canvas size
  canvas.width = CONFIG.GRID_WIDTH * CONFIG.CELL_SIZE;
  canvas.height = CONFIG.GRID_HEIGHT * CONFIG.CELL_SIZE + 40; // Extra space for UI

  // Create systems
  const inputSystem = createInputSystem();
  const renderSystem = createRenderSystem(canvas);

  // Define update pipeline (order matters!)
  // This demonstrates function composition - systems are composed together
  const updateSystems = [
    inputSystem,      // 1. Process input
    movementSystem,   // 2. Move snake
    collisionSystem,  // 3. Check collisions
    growthSystem      // 4. Handle growth/food
  ];

  // Create game loop
  const gameLoop = createGameLoop(updateSystems, renderSystem);

  // Initialize and start game
  const initialWorld = initializeGame(canvas);
  gameLoop.start(initialWorld);

  // Expose game loop for debugging
  window.gameLoop = gameLoop;

  console.log('Snake Game Started!');
  console.log('Controls: Arrow Keys or WASD to move, Space to pause');
};

// Start game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
