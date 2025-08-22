import { abs, resetXY, sign } from "./basic";
import { canvas, ctx } from "./canvas";
import { Vector } from "./vector";

class Camera {
  constructor(pos, zoom = 1, rotation = 0) {
    this.pos = pos;
    this.targetPos = pos.clone();
    this.zoom = zoom;
    this.zoomTarget = zoom;
    this.rotation = rotation;
    this.rotationTarget = rotation;
    this.boundary = resetXY(150/zoom, 80/zoom);
    this.smoothness = 0.01;
  }

  follow(pos) {

    const diffXY = pos.substract(this.targetPos)
    
    if (abs(diffXY.x) > this.boundary.x) {

      this.targetPos = pos.substract(resetXY(this.boundary.x*sign(diffXY.x),0))

    }
    if (abs(diffXY.y) > this.boundary.y) {

      this.targetPos = pos.substract(resetXY(0,this.boundary.y*sign(diffXY.y)))

    }
  }

  update() {
    
    this.pos.add(this.targetPos.clone().substract(this.pos).dot(this.smoothness))
    
  }

  draw() {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate(this.rotation);
    ctx.translate(-this.pos.x, -this.pos.y);
  }
}

export {Camera}