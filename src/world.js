import {Point} from './point';

// Definition: a _scene_ is a window of the world displayed on the screen.
// Its coordinates are the character grid coordinates (e.g. each point is on the character grid)

export const SCENE_WIDTH = 70; // 70 text cells wide
export const SCENE_HEIGHT = 35; // 35 text cells high

let scenePoints = [];

for (let x = 0; x < SCENE_WIDTH; ++x) {
  for (let y = 0; y < SCENE_HEIGHT; ++y) {
    scenePoints.push(new Point(x, y));
  }
}

export class World {
  constructor() {
    this.floorTiles = new Map();
  }

  draw(font, cameraPos = new Point(0, 0)) {
    scenePoints.forEach(point => {
      let tile = this.floorTiles.get(JSON.stringify(cameraPos.plus(point)));
      if (tile == null) {
        let p = cameraPos.plus(point);
        throw new Error(`Error: tile not generated at point ${p.x}, ${p.y}`);
      }

      font.drawChar(...point.toScreenSpace(), tile, 'grey');
    }, this);
  }

  /**
   * Generate new random world
   * @param scenePos coordinate of scene in the world, e.g. scenePos == {x: 1, y: 2} is the second scene to the right,
   * third scene down
   */
  randomizeScene(scenePos) {
    let worldPos = new Point(scenePos.x * SCENE_WIDTH, scenePos.y * SCENE_HEIGHT);

    scenePoints.forEach(point => {
      let char;
      let r = Math.floor(Math.random() * 4);
      if (r === 0) char = '`';
      else if (r === 1) char = '\'';
      else if (r === 2) char = '.';
      else if (r === 3) char = ',';

      this.floorTiles.set(JSON.stringify(point.plus(worldPos)), char);
    }, this);
  }
}