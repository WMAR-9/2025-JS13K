import { abs, floor, resetXY, sign } from "./basic";
import { canvas, ctx } from "./canvas";
import { GameInit } from "./init";
import { Vector } from "./vector";

class Camera {
  constructor(pos, zoom = 1) {
    this.pos = pos;
    this.tPos = pos.clone();
    this.zoom = zoom;
    this.bond = resetXY(150/zoom, 80/zoom);
    this.smoothness = 0.0055;
  }

  follow(pos) {

    const diffXY = pos.substract(this.tPos)
    
    if (abs(diffXY.x) > this.bond.x) {

      this.tPos = pos.substract(resetXY(this.bond.x*sign(diffXY.x),0))

    }
    if (abs(diffXY.y) > this.bond.y) {

      this.tPos = pos.substract(resetXY(0,this.bond.y*sign(diffXY.y)))

    }
    this.update()
  }

  update() {
    
    this.pos.add(this.tPos.clone().substract(this.pos).dot(this.smoothness))
    this.draw()
  }

  draw() {
    ctx.translate(GameInit.wwid / 2, GameInit.tileW/2+GameInit.tileW);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.pos.x,-this.pos.y);
  }
}

export {Camera}