import {SCENE_WIDTH, SCENE_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT} from './point';
import {fontText} from './font';

export function makeWaitTickMessage() {
  let timer = 0;
  let numTicksWaited = 0;

  return {
    draw(font, state) {
      if (state.manualTimeTick) {
        state.manualTimeTick = false;
        numTicksWaited++;
        timer = 1;
      }

      if (timer > 0) {
        font.drawText((SCENE_WIDTH - 17) * CHAR_WIDTH, (SCENE_HEIGHT - 3) * CHAR_HEIGHT,
          fontText.fColor(`rgba(${timer * 255}, ${timer * 255}, ${timer * 255})`)
            .text(`Waited ${numTicksWaited} tick${numTicksWaited === 1 ? '' : 's'}`));

        timer -= state.timeSinceLastDraw / 200000;
        state.drawTainted = true;
      } else {
        numTicksWaited = 0;
        timer = 0;
      }
    }
  };
}