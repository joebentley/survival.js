import {assert} from 'chai';

// Check if in browser environment
if (typeof window !== 'undefined')
  mocha.setup('bdd');

import {Entity, replaceEntity} from '../src/entity';
import {Point, SCENE_HEIGHT, SCENE_WIDTH} from '../src/point';

describe('Entity', () => {
  describe('#clone()', () => {
    it('should deep clone all properties including functions', () => {
      let entity = new Entity(new Point(1, 2), 'a');
      entity.test = true;
      entity.behaviours.push(function(state) {
        this.b = 10; // generally shouldn't mutate `this`, but it should at least work
        state.a = 5;
      });

      let cloned = entity.clone();
      assert(cloned.worldPos.equals(new Point(1, 2)), 'worldPos should be cloned');
      assert(cloned.graphic === 'a', 'graphic should be cloned');
      assert(cloned.test === true, 'test should be cloned');

      let state = cloned.update({});

      assert(state.a === 5, 'state should be altered');
      assert(cloned.b === 10, 'this should be altered');
    });
  });

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

  describe('#update()', () => {
    it('should call each behaviour function attached to entity', () => {
      let entity = new Entity();
      entity.behaviours.push(state => {
        assert(state.a === 1);
        state.b = 1;
      });
      entity.behaviours.push(state => {
        assert(state.b === 1);
        state.c = 1;
      });
      let state = entity.update({a: 1});
      assert(state.c === 1);
    });

    it('should bind the entity\'s `this` to the behaviour function on update', () => {
      let entity = new Entity(new Point(2, 2));
      entity.behaviours.push(function () {
        assert(this.worldPos.equals(new Point(2, 2)));
      });
      entity.update();
    });
  });
});

describe('replaceEntity()', () => {
  it('should deep clone entity, remove previous one, and update entity', () => {
    let entity = new Entity(new Point(1, 2));
    let entity2 = new Entity(new Point(1, 3));
    let entityList = [entity, entity2];

    let newEntityList = replaceEntity(entity, entity => entity.worldPos = new Point(2, 2), entityList);

    assert(!newEntityList.includes(entity), 'should not include original entity');
    assert(newEntityList[1].worldPos.equals(new Point(2, 2)), 'should have altered world pos');
    assert(newEntityList.length === 2, 'should only include two entities');
    assert(newEntityList[1].draw !== undefined, 'should have kept methods');
  });
});