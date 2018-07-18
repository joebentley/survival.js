
import {Font, fontText} from './font';
import {CHAR_WIDTH, CHAR_HEIGHT, SCENE_WIDTH, SCENE_HEIGHT, Point} from './point';
import {World} from './world';
import {Player} from './player';
import {Cat} from './entity';
import {makeWaitTickMessage} from './ui';

function loadImage(path) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = path;
    image.onload = () => resolve(image);
    image.onerror = () => reject();
  });
}

const maskOutColor = (imageData, color) => {
  const getColorIndicesForCoord = (x, y, width) => {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  };

  for (let x = 0; x < imageData.width; ++x) {
    for (let y = 0; y < imageData.height; ++y) {
      const [redIndex, greenIndex, blueIndex, alphaIndex] = getColorIndicesForCoord(x, y, imageData.width);
      const [red, green, blue] = [imageData.data[redIndex], imageData.data[greenIndex], imageData.data[blueIndex]];
      if (red === color.r && green === color.g && blue === color.b) {
        imageData.data[alphaIndex] = 0;
      }
    }
  }
};

const getMaskedCanvas = (image, color) => {
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  let imageData = ctx.getImageData(0, 0, image.width, image.height);
  maskOutColor(imageData, color);
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const loop = (state, time) => {
  state.timeSinceLastDraw = (time - state.timeSinceLastDraw) || 0;

  // state updates

  for (let key of pressedKeys) {
    Object.assign(state, state.player.onInput(key));
    // note: this will automatically do key repeat, as the keydown event will fire and reset pressedKeys
    // each time the key repeat fires!
    pressedKeys.delete(key);
  }

  if (state.updateEntities) {
    for (let entity of state.entities) {
      Object.assign(state, entity.update(state));
    }
    state.updateEntities = false;
  }

  let {font, world, player, entities, ctx, canvas} = state;

  // drawing, only draw if state has been tainted

  if (state.drawTainted) {
    state.drawTainted = false;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    world.draw(font, state);

    // font.drawChar(...Point.fromGridToScreen(2, 2), 'dwarf');
    // font.drawText(...Point.fromGridToScreen(2, 2), 'A happy dwarf $(dwarf)! woo!');
    // font.drawText(...Point.fromGridToScreen(2, 2),
    //   fontText.fColor('red').text('A happy ').bColor('yellow').text('dwarf $(dwarf)!').reset().text(' woo!'));

    for (let entity of entities) {
      entity.draw(font, state);
    }

    player.draw(font);

    state.ui.waitTickMessage.draw(font, state);
  }

  requestAnimationFrame(time => loop(state, time));
};

let pressedKeys = new Set();

window.onload = () => {
  let canvas = document.querySelector('#game');
  canvas.width = CHAR_WIDTH * SCENE_WIDTH;
  canvas.height = CHAR_HEIGHT * SCENE_HEIGHT;
  let ctx = canvas.getContext('2d');

  const player = new Player(new Point(SCENE_WIDTH * (100 + 0.5), SCENE_HEIGHT * (100 + 0.5)));

  loadImage('images/curses_800x600.bmp')
    .then(image => {
      let maskedCanvas = getMaskedCanvas(image, {r: 255, g: 0, b: 255});

      let font = new Font(maskedCanvas, ctx);

      let entities = [new Cat(player.worldPos.plus(new Point(10, 10)))];

      loop({
        font,
        world: new World(),
        player,
        entities,
        drawTainted: true,
        canvas,
        ctx,
        ui: {waitTickMessage: makeWaitTickMessage()}
      });
    });

  document.addEventListener('keydown', (event) => {
    pressedKeys.add(event.key);
    event.preventDefault();
  });

  document.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.key);
    event.preventDefault();
  });
};