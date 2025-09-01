import { min } from "../basic";
import { ctx, dIso } from "../canvas";
import { GameInit } from "../init";
import { Timer } from "../timer";

class TypewriterSprite{
  constructor(t,o={}) {
    this.cps=o.cps??20; this.f=o.f??0;
    this.ls=o.ltS??4; 
    this.lh=o.lnS??8;
    this.max=o.mC??16;
    this._t = new Timer(1/5,1)
    this._t.et = t.length
    this.set(t)
  }
  set(t){this.text=t??"";this._chars=[...this.text];this.visible=0;this.elapsed=0;this.done=0;}
  skip(){this.visible=this._chars.length;this.done=1;}
  update(){
    this.draw()
    this._t.start()
    if(this.done)return;
    this.visible=min(this._t.s,this._chars.length);
    if(this.visible>=this._chars.length)this.done=1;
  }
  draw(){
    const size = GameInit.tileW/6
    const x = GameInit.wwid/8; 
    const y = GameInit.whei/6
    ctx.save()
    ctx.globalAlpha = .5
    ctx.fillStyle="#000"
    ctx.fillRect(0,0,GameInit.wwid,GameInit.whei)
    ctx.restore()
    let col=0,row=0;

    for(let i=0;i<this.visible;i++){
      let ch=this._chars[i];
      if(ch=='\n'){row++;col=0;}
      if(ch==" ")col++;
      let g=GameInit.f[ch.toLowerCase()];
      if(g){
        ctx.drawImage(g[this.f]||g[0],x+col*(size+this.ls),y+row*(size+this.lh),size,size);
        col++
      }
    }

    let t = "next"
    for(let i=0;i<4;i++){
      dIso(GameInit.f[t[i]][this.f],i*size,size,x*6,y*5.5,0,this._t.s,1)
    }
    GameInit.mbtn = {t:2,x:x*6,y:y*5.5,w:4*size,h:size}
    
  }
}
export{TypewriterSprite}