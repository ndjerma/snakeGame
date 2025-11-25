// Core ECS Engine - Functional implementation

/**
 * Create initial empty world state
 * Returns immutable state structure
 */
export const createWorld = () => ({
  entities: new Map(),           // entityId -> Set of component types
  components: new Map(),         // componentType -> Map(entityId -> componentData)
  nextEntityId: 1,
  gameStatus: 'playing',
  inputs: { direction: null, pendingDirection: null },
  score: 0,
  snakeBody: []                  // Array of entity IDs in order [head, ...body]
});

/**
 * Create a new entity
 * Returns [newWorld, entityId]
 */
export const createEntity = (world) => {
  const entityId = world.nextEntityId;
  const newEntities = new Map(world.entities);
  newEntities.set(entityId, new Set());

  return [
    {
      ...world,
      entities: newEntities,
      nextEntityId: entityId + 1
    },
    entityId
  ];
};

/**
 * Add component to entity
 * Pure function - returns new world
 */
export const addComponent = (world, entityId, componentType, componentData) => {
  // Update entity's component set
  const entityComponents = new Set(world.entities.get(entityId) || new Set());
  entityComponents.add(componentType);

  const newEntities = new Map(world.entities);
  newEntities.set(entityId, entityComponents);

  // Update component storage
  const componentMap = new Map(world.components.get(componentType) || new Map());
  componentMap.set(entityId, componentData);

  const newComponents = new Map(world.components);
  newComponents.set(componentType, componentMap);

  return {
    ...world,
    entities: newEntities,
    components: newComponents
  };
};

/**
 * Remove entity completely
 * Pure function - returns new world
 */
export const removeEntity = (world, entityId) => {
  const entity = world.entities.get(entityId);
  if (!entity) return world;

  // Remove entity from all component maps
  const newComponents = new Map(world.components);
  entity.forEach(componentType => {
    const componentMap = new Map(newComponents.get(componentType) || new Map());
    componentMap.delete(entityId);
    newComponents.set(componentType, componentMap);
  });

  // Remove entity itself
  const newEntities = new Map(world.entities);
  newEntities.delete(entityId);

  return {
    ...world,
    entities: newEntities,
    components: newComponents
  };
};

/**
 * Get component data for entity
 * Returns component data or undefined
 */
export const getComponent = (world, entityId, componentType) => {
  return world.components.get(componentType)?.get(entityId);
};

/**
 * Check if entity has component
 */
export const hasComponent = (world, entityId, componentType) => {
  return world.entities.get(entityId)?.has(componentType) || false;
};

/**
 * Query entities with ALL specified components
 * Returns array of entity IDs
 * Uses filter to find matching entities
 */
export const queryEntities = (world, ...componentTypes) => {
  return Array.from(world.entities.keys()).filter(entityId =>
    componentTypes.every(type => hasComponent(world, entityId, type))
  );
};

/**
 * Update component data for entity
 * Pure function - returns new world
 */
export const updateComponent = (world, entityId, componentType, updater) => {
  const currentData = getComponent(world, entityId, componentType);
  if (currentData === undefined) return world;

  const newData = typeof updater === 'function'
    ? updater(currentData)
    : updater;

  return addComponent(world, entityId, componentType, newData);
};

/**
 * Get all entities with a specific component
 * Returns Map of entityId -> componentData
 */
export const getAllComponents = (world, componentType) => {
  return world.components.get(componentType) || new Map();
};
