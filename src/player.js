import {Point} from './point';
import {Entity} from './entity';

export class Player extends Entity {
  constructor(worldPos) {
    super(worldPos, '$(dwarf)');
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

    return {
      player: new Player(this.worldPos.plus(posOffset)),
      drawTainted: !(posOffset.equals(Point.zero)) || key === '.',
      updateEntities: !(posOffset.equals(Point.zero)) || key === '.',
      manualTimeTick: key === '.'
    };
  }
}