import {Point, SCENE_WIDTH, SCENE_HEIGHT} from './point';

// Definition: a _scene_ is a window of the world displayed on the screen.
// Its coordinates are the character grid coordinates (e.g. each point is on the character grid)

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

  draw(font, state) {
    let player = state.player;
    let cameraPos = new Point(
      player.worldPos.x - (player.worldPos.x % SCENE_WIDTH),
      player.worldPos.y - (player.worldPos.y % SCENE_HEIGHT)
    );

    scenePoints.forEach(point => {
      let tile = this.floorTiles.get(JSON.stringify(cameraPos.plus(point)));
      if (tile == null) {
        let p = cameraPos.plus(point);
        let scenePoint = new Point(Math.floor(p.x / SCENE_WIDTH), Math.floor(p.y / SCENE_HEIGHT));
        // generate next scene
        this.randomizeScene(scenePoint);
        tile = this.floorTiles.get(JSON.stringify(cameraPos.plus(point)));
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