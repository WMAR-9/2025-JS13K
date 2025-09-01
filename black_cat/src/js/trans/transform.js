import { max, min } from "../basic";
import { ctx } from "../canvas";
import { GameInit } from "../init";
import { Timer } from "../timer";

const easeOutQuad = t => t * (2 - t);

class TransitionEffect {
  constructor(fadeIn = 0, duration = 3000) {
    
    this.targets = GameInit.cats.map(obj => ({
      pos: obj.pos,
      timer: new Timer(1/duration), 
    }));

    this.mr = max(GameInit.wwid,GameInit.whei);
    this.minr = .5;
    this.isrun = 1;
    this.fadeIn = fadeIn;
  }

  update() {
    if (!this.isrun) return;

    ctx.save();
    // ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha=this.fadeIn?.4:.7
    let allDone = 1;

    this.targets.forEach(t => {
      const progress = t.timer.progress;
      const eased = easeOutQuad(progress);
      let radius;

      if (this.fadeIn) {
        radius = min(this.minr + eased * (this.mr - this.minr), this.mr);
      } else {
        radius = this.mr - eased * (this.mr - this.minr);
      }

      ctx.beginPath();

      ctx.arc(
        t.pos.x,
        t.pos.y,
        radius,
        0, Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
      t.timer.start();
      if (progress < 1) allDone = false;
    });

    ctx.restore();

    
    this.isrun = !allDone;
  }
}

export { TransitionEffect, easeOutQuad }
