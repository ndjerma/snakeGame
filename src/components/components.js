// Component type constants
export const ComponentType = {
  POSITION: 'Position',
  SNAKE_HEAD: 'SnakeHead',
  SNAKE_SEGMENT: 'SnakeSegment',
  FOOD: 'Food',
  RENDERABLE: 'Renderable'
};

// Component factory functions (pure functions that create component data)

export const createPosition = (x, y) => ({ x, y });

export const createSnakeHead = () => ({});

export const createSnakeSegment = (index) => ({ index });

export const createFood = (value) => ({ value });

export const createRenderable = (color, shape = 'rect', size = 1) => ({
  color,
  shape,
  size
});
