import {fontText} from './font';
import {Point, SCENE_HEIGHT, SCENE_WIDTH} from './point';

export class Entity {
  constructor(worldPos, graphic) {
    this.worldPos = worldPos;
    this.graphic = graphic;
    this.behaviours = [];
  }

  isOnScreen(playerWorldPos) {
    let scenePos = new Point(
      Math.floor(playerWorldPos.x / SCENE_WIDTH),
      Math.floor(playerWorldPos.y / SCENE_HEIGHT));

    return this.worldPos.x > scenePos.x * SCENE_WIDTH && this.worldPos.y > scenePos.y * SCENE_HEIGHT
      && this.worldPos.x <= (scenePos.x + 1) * SCENE_WIDTH && this.worldPos.y <= (scenePos.y + 1) * SCENE_HEIGHT;

  }

  draw(font, state) {
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

    this.behaviours.push(state => {
      let posOffset = new Point(
        Math.random() < 0.01 ? (Math.random() < 0.5 ? 1 : -1) : 0,
        Math.random() < 0.01 ? (Math.random() < 0.5 ? 1 : -1) : 0);

      if (!posOffset.equals(Point.zero)) {
        let cat = new Cat(this.worldPos.plus(posOffset));
        let entities = state.entities.slice().filter(entity => entity !== this, this);
        entities.push(cat);
        return {drawTainted: true, entities};
      }
    });
  }
}