import {assert} from 'chai';

// Check if in browser environment
if (typeof window !== 'undefined')
  mocha.setup('bdd');

import {Entity} from '../src/entity';
import {Point, SCENE_HEIGHT, SCENE_WIDTH} from '../src/point';

describe('Entity', () => {
  describe('#isOnScreen()', () => {
    it('should determine if player is on screen or not correctly', () => {
      let entity = new Entity();
      let playerWorldPos = new Point(SCENE_WIDTH * 2 - 1, SCENE_HEIGHT * 2 - 1);

      assert(!entity.isOnScreen(playerWorldPos), 'should be false');
      entity.worldPos = new Point(SCENE_WIDTH, SCENE_HEIGHT);
      assert(entity.isOnScreen(playerWorldPos), 'should be true');
      entity.worldPos = new Point(SCENE_WIDTH * 2 - 1, SCENE_HEIGHT * 2 - 1);
      assert(entity.isOnScreen(playerWorldPos), 'should be true');
      entity.worldPos = new Point(SCENE_WIDTH, 0);
      assert(!entity.isOnScreen(playerWorldPos), 'should be false');
      entity.worldPos = new Point(0, SCENE_HEIGHT);
      assert(!entity.isOnScreen(playerWorldPos), 'should be false');
    });
  });
});