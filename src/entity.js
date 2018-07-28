import {fontText} from './font';
import {Point, SCENE_HEIGHT, SCENE_WIDTH} from './point';

export class Entity {
  constructor(worldPos, graphic) {
    this.worldPos = (worldPos || new Point(0, 0)).round();
    this.graphic = graphic;
    this.behaviours = [];
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

  update(state) {
    for (let behaviour of this.behaviours) {
      Object.assign(state, behaviour(state));
    }
    return state;
  }
}

export class Cat extends Entity {
  constructor(worldPos) {
    super(worldPos, fontText.fColor('yellow').text('c'));

    this.behaviours.push(wanderingBehaviour.bind(this));
  }
}

export function wanderingBehaviour(state) {
  let posOffset = new Point(
    Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0,
    Math.random() < 0.2 ? (Math.random() < 0.5 ? 1 : -1) : 0);

  if (!posOffset.equals(Point.zero)) {
    let entity = new this.constructor(this.worldPos.plus(posOffset));
    let entities = state.entities.slice().filter(entity => entity !== this, this);
    entities.push(entity);
    return {drawTainted: true, entities};
  }
}