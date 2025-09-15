import { min, randInt } from "../basic";
import { ctx, dIso } from "../canvas";
import { GameInit } from "../init";
import { Timer } from "../timer";

let msg = GameInit.msg
let ltip = GameInit.ltip
class TypewriterSprite{
  constructor(t,o={}) {
    this.cps=o.cps??3; this.f=o.f??0;
    this.ls=o.ltS??4; 
    this.lh=o.lnS??8;
    this.max=o.mC??16;
    this._t = new Timer(1/5,1)
    this.nm = t+2
    this.set(t?
      msg[randInt(4)-1]+msg[msg.length-(GameInit.level>=GameInit.maxLevel?2:1)]:
      o.d?ltip[ltip.length-2]:(ltip[ltip.length-1]+GameInit.ltip[GameInit.level])
    )
  }
  set(t){
    
    this.tx=t??"";
    this._c=[...this.tx];
    this.visible=0;
    this.elapsed=0;
    this.done=0;
    this.isrun=1;
    this._t.et = t.length
  }
  skip(){
    this.visible=this._c.length;
    this.done=1;
  }
  update(){
    this.draw()
    this._t.start()
    if(this.done)return;
    this.visible=min(this._t.s,this._c.length);
    if(this.visible>=this._c.length)this.done=1;
  }
    draw() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const maxSize = min(GameInit.wwid / 20, GameInit.whei / 15);
    const size = min(GameInit.tileW / 6, maxSize);

    const ls = size * 0.25; 
    const lh = size * 0.5; 

    const x = GameInit.wwid * 0.1;
    const y = GameInit.whei * 0.2;

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, GameInit.wwid, GameInit.whei);
    ctx.globalAlpha = 1;

    let col = 0, row = 0;
    for (let i = 0; i < this.visible; i++) {
      let ch = this._c[i];
      if (ch == "\n") { row++; col = 0; continue; }
      if (ch == " ") { col++; continue; }
      let g = GameInit.f[ch.toLowerCase()];
      if (g) {
        ctx.drawImage(
          g[this.f],
          x + col * (size + ls),
          y + row * (size + lh),
          size,
          size
        );
        col++;
      }
    }

    const xx = GameInit.wwid/8; 
    const yy = GameInit.whei/6
    let t = "click"
    for(let i=0;i<5;i++){
      dIso(GameInit.f[t[i]][this.f], i*size, size, xx*6, yy*5.5, 1,0, this._t.s, 1)
    }

    GameInit.mbtn = {
      t: this.nm,
      x: 0,
      y: 0,
      w: GameInit.wwid,
      h: GameInit.whei,
    };

    ctx.restore();
  }
  // draw(){
  //   ctx.save();
  //   ctx.setTransform(1,0,0,1,0,0); 

  //   const size = GameInit.tileW/6
  //   const x = GameInit.wwid/8; 
  //   const y = GameInit.whei/6

  //   ctx.globalAlpha = 0.8
  //   ctx.fillStyle="#000"
  //   ctx.fillRect(0,0,GameInit.wwid,GameInit.whei)
  //   ctx.globalAlpha = 1;

  //   let col=0,row=0;
  //   for(let i=0;i<this.visible;i++){
  //     let ch=this._c[i];
  //     if(ch=='\n'){row++;col=0; continue;}
  //     if(ch==" "){col++; continue;}
  //     let g=GameInit.f[ch.toLowerCase()];
  //     if(g){
  //       ctx.drawImage(g[this.f],x+col*(size+this.ls),y+row*(size+this.lh),size,size);
  //       col++;
  //     }
  //   }

  //   let t = "click"
  //   for(let i=0;i<5;i++){
  //     dIso(GameInit.f[t[i]][this.f], i*size, size, x*6, y*5.5, 1,0, this._t.s, 1)
  //   }
    
  //   GameInit.mbtn = {t:this.nm,x:x*6-size/2,y:y*5.5-size/2,w:4*size,h:size}

  //   ctx.restore()
  // }
}
export{TypewriterSprite}