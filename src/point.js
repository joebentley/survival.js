
export const CHAR_HEIGHT = 12; // 20; // 12;
export const CHAR_WIDTH = 10; // 20; // 8;

// Definition: a _scene_ is a window of the world displayed on the screen.
// Its coordinates are the character grid coordinates (e.g. each point is on the character grid)

export const SCENE_WIDTH = 70; // 70 text cells wide
export const SCENE_HEIGHT = 35; // 35 text cells high

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  toScreenSpace() {
    return new Point((this.x % SCENE_WIDTH) * CHAR_WIDTH, (this.y % SCENE_HEIGHT) * CHAR_HEIGHT);
  }

  static fromGridToScreen(x, y) {
    return new Point(x, y).toScreenSpace();
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }
}

Point.zero = new Point(0, 0);