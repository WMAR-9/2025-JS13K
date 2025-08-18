import { abs, resetXY, sign } from "./basic";

class Camera {
  constructor(pos, zoom = 1, rotation = 0) {
    this.x = x;
    this.y = y;
    this.pos = pos.clone()
    this.targetX = x;
    this.targetY = y;
    this.targetPos = pos.clone()
    this.zoom = zoom;
    this.zoomTarget = zoom;
    this.rotation = rotation;
    this.rotationTarget = rotation;
    this.boundary = resetXY(100,60);
  }

  follow(pos) {

    let dx = pos.x - this.targetX;
    let dy = pos.y - this.targetY;

    let dpos = pos.clone().substract(this.targetPos)

    if (abs(dx) > this.boundary.x) {
      this.targetX = pos.x - this.boundary.x * sign(dx);
    }
    if (abs(dy) > this.boundary.y) {
      this.targetY = pos.y - this.boundary.y * sign(dy);
    }

  }

  update(s) {

    this.pos.add(this.targetPos.clone().substract(this.pos).dot(s))

    this.x += (this.targetX - this.x) * s;
    this.y += (this.targetY - this.y) * s;

    console.log("POS: ",this.pos,this.x,this.y)
    
    // if (keys['+']) this.zoomTarget *= 1.01;
    // if (keys['-']) this.zoomTarget /= 1.01;
    
    // this.zoom += (this.zoomTarget - this.zoom) * 0.1;

    // if (keys['a']) this.rotationTarget -= 0.01;
    // if (keys['d']) this.rotationTarget += 0.01;
    
    // this.rotation += (this.rotationTarget - this.rotation) * 0.1;
  }

  draw() {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.rotate(this.rotation);
    ctx.translate(-this.pos.x, -this.pos.y);
  }
}

export {Camera}