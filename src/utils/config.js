// Game configuration constants
export const CONFIG = {
  GRID_WIDTH: 20,
  GRID_HEIGHT: 20,
  CELL_SIZE: 25,
  INITIAL_SPEED: 5,      // moves per second
  INITIAL_LENGTH: 3,
  FOOD_VALUE: 10,
  COLORS: {
    BACKGROUND: '#1a1a1a',
    SNAKE_HEAD: '#4ade80',
    SNAKE_BODY: '#22c55e',
    FOOD: '#ef4444',
    GRID: '#333333',
    TEXT: '#ffffff'
  }
};

// Direction constants
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

// Key mappings
export const KEY_MAPPINGS = {
  'ArrowUp': DIRECTIONS.UP,
  'KeyW': DIRECTIONS.UP,
  'ArrowDown': DIRECTIONS.DOWN,
  'KeyS': DIRECTIONS.DOWN,
  'ArrowLeft': DIRECTIONS.LEFT,
  'KeyA': DIRECTIONS.LEFT,
  'ArrowRight': DIRECTIONS.RIGHT,
  'KeyD': DIRECTIONS.RIGHT
};
