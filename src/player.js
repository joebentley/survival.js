import {Point} from './point';

export class Player {
  constructor(worldPos = new Point(10, 10)) {
    this.graphic = '$(dwarf)';
    this.worldPos = worldPos;
  }

  onInput(key) {
    let posOffset = new Point(0, 0);

    if (key === 'h') posOffset = new Point(-1, 0);
    else if (key === 'l') posOffset = new Point(1, 0);
    else if (key === 'k') posOffset = new Point(0, -1);
    else if (key === 'j') posOffset = new Point(0, 1);
    else if (key === 'y') posOffset = new Point(-1, -1);
    else if (key === 'u') posOffset = new Point(1, -1);
    else if (key === 'b') posOffset = new Point(-1, 1);
    else if (key === 'n') posOffset = new Point(1, 1);

    return {player: new Player(this.worldPos.plus(posOffset))};
  }

  draw(font) {
    let screenPos = this.worldPos.toScreenSpace();
    font.drawText(screenPos.x, screenPos.y, this.graphic);
  }
}