import { rand } from "../basic";
import { ctx } from "../canvas";
import { GameInit } from "../init";
import { Timer } from "../timer";

class Msg {
  constructor(x, y, n=0,t=0) {
    this.x = x;   
    this.y = y;
    this.t= t;
    this.timer = new Timer(1/30)
    this.idlet = this.timer.clone()
    this.closet = this.timer.clone()
    this.active = 0
    this.stop=0
    this.cm(n)
  }
  reset(){
    this.stop = 0
    this.active = 0
    this.timer.reset()
    this.idlet.reset()
    this.closet.reset()
  }

  show(n,t=""){
    this.stop = 1
    this.active = 1
    this.timer.startTime = 1
    this.cm(n,t)
  }

  changeXY(pos){
    this.x = pos.x - GameInit.tileW/25
    this.y = pos.y - GameInit.tileW/15
  }
  cm(n,t=""){
    this.msg = GameInit.cmsg[n]+t;
  }
  update(){
    if(this.stop)return;
    if(rand(1)>.3)return;
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

    let _ch = " "+this.msg+" ",size = GameInit.tileW/30

    const textWidth = (_ch.length)*size;
    const boxWidth = textWidth + size * 2;
    const boxHeight = size + size * 2;

    const boxX = this.x - boxWidth / 2;
    const boxY = this.y - size * 5.5; 

    ctx.save();
    ctx.globalAlpha = this.stop ? 1 : this.timer.progress;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 8);
    ctx.moveTo(this.x, this.y - size);           
    ctx.lineTo(this.x - size, boxY + boxHeight); 
    ctx.lineTo(this.x + size, boxY + boxHeight); 
    ctx.closePath();
    ctx.fill();

    let drawX = boxX + size;
    for (let i = 0; i < _ch.length; i++) {
        if (_ch[i] === " ") {
            drawX += size / 2;
            continue;
        }
        let g = GameInit.f[_ch[i].toLowerCase()];
        if (g) {
            ctx.drawImage(g[this.t], drawX, boxY+size , size, size);
            drawX += size+size/3;
        }
    }
    ctx.restore();
  }
}

export { Msg };