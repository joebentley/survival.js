
import {Font, fontText} from './font';
import {Point} from './point';

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

window.onload = () => {
  let canvas = document.querySelector('#game');
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  loadImage('images/curses_800x600.bmp')
    .then(image => {
      let maskedCanvas = getMaskedCanvas(image, {r: 255, g: 0, b: 255});

      let font = new Font(maskedCanvas, ctx);
      // font.drawChar(...Point.fromGridToScreen(2, 2), 'dwarf');
      // font.drawText(...Point.fromGridToScreen(2, 2), 'A happy dwarf $(dwarf)! woo!');
      font.drawText(...Point.fromGridToScreen(2, 2),
        fontText.fColor('red').text('A happy ').bColor('yellow').text('dwarf $(dwarf)!').reset().text(' woo!'));
    });
};