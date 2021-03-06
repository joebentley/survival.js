import {fontText} from './font';
import {Point, SCENE_HEIGHT, SCENE_WIDTH} from './point';

export class Entity {
  constructor(worldPos, graphic) {
    this.worldPos = (worldPos || new Point(0, 0)).round();
    this.graphic = graphic;
    this.behaviours = [];
  }

  clone() {
    let entity = new Entity();

    for (let a in this) {
      if (this.hasOwnProperty(a))
        entity[a] = this[a];
    }

    return entity;
  }

  isOnScreen(playerWorldPos) {
    let scenePos = new Point(
      Math.floor(playerWorldPos.x / SCENE_WIDTH),
      Math.floor(playerWorldPos.y / SCENE_HEIGHT));

    return this.worldPos.x >= scenePos.x * SCENE_WIDTH && this.worldPos.y >= scenePos.y * SCENE_HEIGHT
      && this.worldPos.x < (scenePos.x + 1) * SCENE_WIDTH && this.worldPos.y < (scenePos.y + 1) * SCENE_HEIGHT;
  }

  draw(font, state) {
    // TODO: Cache which entities are on screen?
    if (!state || this.isOnScreen(state.player.worldPos)) {
      let screenPos = this.worldPos.toScreenSpace();
      font.drawText(screenPos.x, screenPos.y, this.graphic);
    }
  }

  update(state = {}) {
    for (let behaviour of this.behaviours) {
      behaviour = behaviour.bind(this);
      Object.assign(state, behaviour(state));
    }
    return state;
  }
}

export class Cat extends Entity {
  constructor(worldPos) {
    super(worldPos, fontText.fColor('yellow').text('c'));

    this.behaviours.push(wanderingBehaviour);
  }
}

/**
 * Creates a clone of entity, optionally updates it using the update callback
 * then replaces entity with the new, updated, clone entity in entityList
 * If update is null then the entity won't be altered, but a new instance will
 * still be created
 * @param {Entity} entity - Reference to the entity to be copied, updated, and replaced
 * @param {function(Entity)} update - Entity update function, which can mutate the entity
 * @param {Array<Entity>} entityList - Current entity list
 * @returns {Array<Entity>} - New entity list with the new entity
 */
export function replaceEntity(entity, update, entityList) {
  let cloned = entity.clone();

  if (update) {
    update(cloned);
  }

  let newEntityList = entityList.slice().filter(e => e !== entity);

  newEntityList.push(cloned);
  return newEntityList;
}

export function wanderingBehaviour(state) {
  let posOffset = new Point(
    Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0,
    Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0);

  if (!posOffset.equals(Point.zero)) {
    let entities = replaceEntity(this, entity => entity.worldPos = entity.worldPos.plus(posOffset), state.entities);
    return {drawTainted: true, entities};
  }
}