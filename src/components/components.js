// Component type constants
export const ComponentType = {
  POSITION: 'Position',
  DIRECTION: 'Direction',
  SNAKE_HEAD: 'SnakeHead',
  SNAKE_SEGMENT: 'SnakeSegment',
  FOOD: 'Food',
  VELOCITY: 'Velocity',
  RENDERABLE: 'Renderable',
  SCORE: 'Score'
};

// Component factory functions (pure functions that create component data)

export const createPosition = (x, y) => ({ x, y });

export const createDirection = (x, y) => ({ x, y });

export const createSnakeHead = () => ({});

export const createSnakeSegment = (index) => ({ index });

export const createFood = (value) => ({ value });

export const createVelocity = (speed) => ({ speed });

export const createRenderable = (color, shape = 'rect', size = 1) => ({
  color,
  shape,
  size
});

export const createScore = (points = 0) => ({ points });
