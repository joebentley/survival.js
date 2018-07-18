import {CHAR_WIDTH, CHAR_HEIGHT} from './font';

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Point(this.x + other.x, this.y + other.y);
  }

  toScreenSpace() {
    return new Point(this.x * CHAR_WIDTH, this.y * CHAR_HEIGHT);
  }

  static fromGridToScreen(x, y) {
    return new Point(x, y).toScreenSpace();
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }
}
