import {CHAR_WIDTH, CHAR_HEIGHT} from './point';

export const NUM_PER_ROW = 16;

const CHARS = 'space dwarf dwarf2 heart diamond club spade circle emptycircle ring emptyring male female note1 note2 gem '
+ 'sloperight slopeleft updown alert pagemark sectionmark thickbottom updown2 up down right left boxbottomleft leftright slopeup slopedown '
+ 'space2 ! " # $ % & \' ( ) * + , - . / '
+ '0 1 2 3 4 5 6 7 8 9 : ; < = > ? '
+ '@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _ '
+ '` a b c d e f g h i j k l m n o p q r s t u v w x y z { : } ~ triangle '
+ 'accentC accentu accente accenta accenta2 accenta3 accenta4 accentc accente2 accente3 accente4 accenti accenti2 accenti3 accentA  accentA2 '
+ 'accentE accentae accentAE accento accento2 accento3 accentu2 accentu3 accenty accentO accentU cent pound yen Pt function '
+ 'accenta5 accenti4 accento4 accentu4 accentn accentN aoverbar ooverbar qmark2 boxtopleft boxtopright half quarter emark2 muchless muchgreater '
+ 'shaded shaded2 shaded3 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 '
+ 'p14 p15 p16 p17 p18 p19 p20 p21 p22 p23 p24 p25 p26 p27 p28 p29 '
+ 'p30 p31 p32 p33 p34 p35 p36 p37 p38 p39 p40 p41 p42 p43 p44 p45 '
+ 'alpha beta Gamma Pi Sigma sigma mu tau Phi theta Omega delta inf ninf in intersect '
+ 'equiv pm gteq lteq upperint lowerint div approx degree cdot hyphen sqrt endquote power2 block space3';


/**
 * Example:
 *
 * font.drawText(
 *   ...Point.fromGridToScreen(2, 2),
 *   fontText.fColor('red').text('A happy ').bColor('yellow').text('dwarf $(dwarf)!').reset().text(' woo!'));
 */
export class FontText {
  constructor(nodes) {
    this.nodes = nodes || [];
  }

  text(text) { return new FontText(this.nodes.concat(text)); }
  fColor(color) { return new FontText(this.nodes.concat({fColor: color})); }
  bColor(color) { return new FontText(this.nodes.concat({bColor: color})); }
  reset() { return new FontText(this.nodes.concat({fColor: 'white'}, {bColor: 'black'})); }
}

export const fontText = new FontText();

export class UnknownCharacterError extends Error {}

export class Font {
  constructor(fontImage, canvasContext) {
    this.fontImage = fontImage;
    this.ctx = canvasContext;
  }

  generateCharacterCache() {
    this.characterCache = new Map();

    for (let [i, char] of CHARS.split(' ').entries()) {
      let x = i % NUM_PER_ROW;
      let y = Math.floor(i / NUM_PER_ROW);
      this.characterCache.set(char, {x: x * CHAR_WIDTH, y: y * CHAR_HEIGHT});
    }
  }

  drawChar(x, y, char, fColor = 'white', bColor = 'black') {
    if (this.characterCache == null)
      this.generateCharacterCache();

    if (char === ' ') char = 'space';

    let charSheetCoord = this.characterCache.get(char);

    if (charSheetCoord == null)
      throw new UnknownCharacterError(`Invalid character ${char}`);

    let rect = {x: charSheetCoord.x, y: charSheetCoord.y, w: CHAR_WIDTH, h: CHAR_HEIGHT};
    let charObject = {char, fColor, bColor};

    // draw background color of character
    this.ctx.fillStyle = bColor;
    this.ctx.fillRect(x, y, rect.w, rect.h);

    if (this._canvasCache == null)
      this._canvasCache = new Map();

    if (!this._canvasCache.has(JSON.stringify(charObject))) {
      // temporary canvas for tinting each character
      let tempCanvas = document.createElement('canvas');
      tempCanvas.width = rect.w;
      tempCanvas.height = rect.h;
      let tempCtx = tempCanvas.getContext('2d');

      tempCtx.globalCompositeOperation = 'source-over';
      tempCtx.clearRect(0, 0, rect.w, rect.h);

      // draw the font character first
      tempCtx.drawImage(this.fontImage, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
      // only keep pixels that overlay the pixels of the character
      tempCtx.globalCompositeOperation = 'source-in';
      tempCtx.fillStyle = fColor;
      // draw colored rectangle over the character, only pixels overlapping the character are kept
      tempCtx.fillRect(0, 0, rect.w, rect.h);

      this._canvasCache.set(JSON.stringify(charObject), tempCanvas);
    }

    // draw tinted character onto main canvas
    this.ctx.drawImage(this._canvasCache.get(JSON.stringify(charObject)), x, y);
  }

  drawText(x, y, text) {
    if (typeof text === 'string') {
      text = fontText.text(text);
    }

    let fColor, bColor;

    for (let node of text.nodes) {
      if (typeof node === 'string') {
        while (node.length > 0) {
          let match = node.match(/^\$\(([\w\d]+)\)/);
          if (match != null) {
            node = node.slice(match[0].length);
            this.drawChar(x, y, match[1], fColor, bColor);
          } else {
            this.drawChar(x, y, node[0], fColor, bColor);
            node = node.slice(1);
          }
          x += CHAR_WIDTH;
        }
      } else if (typeof node === 'object') {
        if (node.fColor) fColor = node.fColor;
        if (node.bColor) bColor = node.bColor;
      }
    }
  }
}