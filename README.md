# Snake Game - Functional ECS Engine

A classic Snake game built with a functional Entity-Component-System (ECS) architecture in pure JavaScript.

## [Play the Game Live](https://ndjerma.github.io/snakeGame/)

## Project Overview

This project implements a complete ECS game engine following functional programming paradigms, with a playable Snake game as the demonstration.

## Features

### ECS Architecture
- **Entities**: Simple numeric IDs
- **Components**: Pure data containers (Position, Direction, Renderable, etc.)
- **Systems**: Pure functions that process entities with specific components

### Functional Programming Principles

✓ **Function Composition**
- Systems composed using `pipe()` in the game loop
- Update pipeline: `input → movement → collision → growth`

✓ **Immutability**
- All state updates return new state objects
- No direct mutations of game state
- Use of spread operators and immutable data structures

✓ **Higher-Order Functions**
- `pipe()` for function composition
- System factories like `createInputSystem()` and `createRenderSystem()`

✓ **Map/Filter/Reduce**
- `map`: Transform entity positions, render all entities
- `filter`: Query entities with components, find collisions
- `reduce`: Thread state through updates, process input queue

## Systems Implemented

### Mandatory Systems
1. **Input System** - Keyboard handling (Arrow keys, WASD, Space)
2. **Rendering System** - Canvas-based rendering with grid

### Custom Systems
3. **Movement System** - Snake movement and body following
4. **Collision System** - Wall, self, and food collision detection
5. **Growth System** - Food spawning and snake growth

## File Structure

```
/FN-Game
├── index.html              # Game HTML container
├── main.js                 # Entry point & initialization
├── src/
│   ├── core/
│   │   ├── ecs.js         # Core ECS engine
│   │   └── game.js        # Game loop
│   ├── systems/
│   │   ├── inputSystem.js
│   │   ├── renderSystem.js
│   │   ├── movementSystem.js
│   │   ├── collisionSystem.js
│   │   └── growthSystem.js
│   ├── components/
│   │   └── components.js
│   └── utils/
│       ├── functional.js   # FP utilities
│       └── config.js       # Game constants
```

## How to Run

### Option 1: Python HTTP Server
```bash
cd FN-Game
python3 -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: Node.js HTTP Server
```bash
npx http-server -p 8000
```

### Option 3: VS Code Live Server
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

## Controls

- **Arrow Keys** or **WASD** - Move snake
- **Space** - Pause/Resume
- **F5** - Restart game

## Game Rules

- Control the snake to eat red food
- Each food increases score by 10 points
- Snake grows by one segment per food
- Game ends if snake hits walls or itself
- Try to get the highest score!

## Code Examples

### Function Composition
```javascript
// Systems are composed in a pipeline
const updatePipeline = pipe(...updateSystems);
// Flow: input → movement → collision → growth
```

### Immutability
```javascript
// All updates return new state objects
const newWorld = updateComponent(
  worldWithDirection,
  headId,
  ComponentType.POSITION,
  newHeadPosition
);
```

### Higher-Order Functions
```javascript
// System factory - returns a configured function
export const createInputSystem = () => {
  let keyQueue = [];

  const processInputs = (world) => {
    // Process inputs and return new world
    return newWorld;
  };

  return processInputs;  // Returns function
};
```

### Functional Array Methods
```javascript
// Map - Transform entity IDs to positions
const oldPositions = world.snakeBody.map(entityId =>
  getComponent(world, entityId, ComponentType.POSITION)
);

// Filter - Find specific entities
const collidedFood = Array.from(foodComponents.keys()).filter(entityId => {
  const foodPos = getComponent(world, entityId, ComponentType.POSITION);
  return foodPos && positionsEqual(headPosition, foodPos);
});

// Reduce - Thread state through multiple updates
newWorld = world.snakeBody.slice(1).reduce((currentWorld, entityId, index) => {
  return updateComponent(currentWorld, entityId, ComponentType.POSITION, previousPosition);
}, newWorld);
```

## Configuration

All game settings are centralized in `src/utils/config.js`:

- **Speed**: `INITIAL_SPEED` controls game update rate
- **Grid size**: `GRID_WIDTH` and `GRID_HEIGHT`
- **Colors**: `COLORS` object for all visual elements
- **Scoring**: `FOOD_VALUE` points per food item

## Technical Notes

- Pure JavaScript ES6+ (no external dependencies)
- Canvas API for rendering
- ECS pattern with functional approach
- 60 FPS rendering, configurable update rate
- Modular system design for easy extension

## About

A Functional Programming course project demonstrating ECS architecture and functional programming principles in JavaScript.
