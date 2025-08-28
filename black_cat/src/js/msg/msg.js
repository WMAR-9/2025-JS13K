import { ctx } from "../canvas";
import { Timer } from "../timer";

class Msg {
  constructor(x, y, msg) {
    this.x = x;   
    this.y = y;
    this.msg = msg;
    this.timer = new Timer(1/180)
    this.idlet = this.timer.clone()
    this.closet = this.timer.clone()
    this.active = 0
    this.stop=0
  }
  reset(){
    this.stop = 0
    this.active = 0
    this.timer.reset()
    this.idlet.reset()
    this.closet.reset()
  }
  show(){
    this.stop = 1
    this.active = 1
    this.timer.startTime = 1
  }
  changeXY(pos){
    this.x = pos.x
    this.y = pos.y
  }

  update(){
    if(this.stop){
      this.closet.start()
      if(this.closet.e)this.reset()
      return;
    }
    (this.active ? this.timer : this.idlet).start();

    if ((this.active && this.timer.e) || (!this.active && this.idlet.e)) {
      this.active = !this.active;
      this.timer.reset();
      this.idlet.reset();
    }
  }
  draw() {
    this.update()
    if(!this.active){
      return;
    }
    const padding = 10;
    const fontSize = 16;

    const textWidth = ctx.measureText(this.msg).width;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = fontSize + padding * 2;

    const boxX = this.x - boxWidth / 2;
    const boxY = this.y - 70; 

    ctx.save();
    ctx.globalAlpha = this.stop ? 1 : this.timer.progress;
    ctx.fillStyle = "#aaa";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
    ctx.moveTo(this.x, this.y - 10);           
    ctx.lineTo(this.x - 10, boxY + boxHeight); 
    ctx.lineTo(this.x + 10, boxY + boxHeight); 
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

export { Msg };