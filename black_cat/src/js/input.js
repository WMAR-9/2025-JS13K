// handle Key 
import { canvas } from "./canvas";
import { GameInit } from "./init";

class Action {
  constructor(canvas,gamemap) {
    this.c = canvas;
    this.gamemap = gamemap

    this.keyIn = {};
    this.keyUp = {};
    this.keyEvent = 0;

    ["keydown","keyup","mousedown","mouseup","touchstart","touchend"]
      .forEach(ev => window.addEventListener(ev, e => this.handle(e)));
  }

  pos(e) {
    if (e.touches?.[0]) {
      let r = this.c.getBoundingClientRect();
      return {x: e.touches[0].clientX-r.left, y: e.touches[0].clientY-r.top};
    }
    return {x: e.offsetX||0, y: e.offsetY||0};
  }

  handle(e) {

    let k = e.which||0, t = e.type;
    // stop key
    if(GameInit.levelcleared)return;

    if(e.repeat)return;
    
    if (t==="keydown"){
      this.keyIn[k]=1;
    }
    if (t==="keyup"){
      this.keyIn[k]=0;
    }
    
    if (t==="mousedown"||t==="touchstart") {
      
      let p = this.pos(e);
      
      this.keyIn.mouse = {...p, active:1};
      
      let btn = GameInit.mbtn;

      if (p.x>=btn.x && p.x<=btn.x+btn.w && p.y>=btn.y && p.y<=btn.y+btn.h) {
          if(btn.t==2){
            GameInit.state=2
            GameInit.restartLevel=1
          }
      }
    }

    if (t==="mouseup"||t==="touchend") {
      this.keyIn.mouse={...this.keyIn.mouse,active:0};
    }
    this.keyEvent = Object.values(this.keyIn).some(v=>v===1||v?.active);

    if (this.keyEvent && this.gamemap && typeof this.gamemap.save === "function" && typeof this.gamemap.undo === "function") {
      if (GameInit.moves[k] && GameInit.cats.every(e => !e.moving && e.fall==0)) { 
        this.gamemap.save()
        GameInit.item.map(e=>e.plusmove())

      }
      if (k == 81) { // Q = undo
        this.gamemap.undo()
        console.log("Undo:");
      }
    }

  } 

  isDown(k){ return this.keyIn[k]===1; }
  hasInput(){ return !!this.keyEvent; }
}

export {Action}