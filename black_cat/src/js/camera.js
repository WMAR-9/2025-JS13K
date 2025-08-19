import { abs, resetXY, sign } from "./basic";
import { canvas, ctx } from "./canvas";
import { Vector } from "./vector";

class Camera {
  constructor(pos, zoom = 1, rotation = 0) {
    this.pos = resetXY(pos.pos.x,pos.pos.y);
    this.targetPos = { x: pos.pos.x, y: pos.pos.y };
    this.zoom = zoom;
    this.zoomTarget = zoom;
    this.rotation = rotation;
    this.rotationTarget = rotation;
    this.boundary = resetXY(150/zoom, 80/zoom);

    this.smoothness = 0.01;
  }

  follow(pos) {
    const dx = pos.pos.x - this.targetPos.x;
    const dy = pos.pos.y - this.targetPos.y;

    if (Math.abs(dx) > this.boundary.x) {
      this.targetPos.x = pos.pos.x - this.boundary.x * Math.sign(dx);
    }
    if (Math.abs(dy) > this.boundary.y) {
      this.targetPos.y = pos.pos.y - this.boundary.y * Math.sign(dy);
    }
  }

  update() {
    this.pos.x += (this.targetPos.x - this.pos.x) * this.smoothness;
    this.pos.y += (this.targetPos.y - this.pos.y) * this.smoothness;
  }

  draw() {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate(this.rotation);
    ctx.translate(-this.pos.x, -this.pos.y);
  }
}

export {Camera}