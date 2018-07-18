export const CHAR_HEIGHT = 12; // 20; // 12;
export const CHAR_WIDTH = 10; // 20; // 8;
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

  drawChar(x, y, char) {
    if (this.characterCache == null)
      this.generateCharacterCache();

    let rect = {...this.characterCache.get(char), w: CHAR_WIDTH, h: CHAR_HEIGHT};

    this.ctx.drawImage(this.fontImage, rect.x, rect.y, rect.w, rect.h, x, y, rect.w, rect.h);
  }

  drawText(x, y, text) {
    let currX = x;

    while (text.length > 0) {
      let match = text.match(/^\$\(([\w\d]+)\)/);
      if (match != null) {
        text = text.slice(match[0].length);
        this.drawChar(x, y, match[1]);
      } else {
        this.drawChar(x, y, text[0]);
        text = text.slice(1);
      }
      x += CHAR_WIDTH;
    }
  }
}