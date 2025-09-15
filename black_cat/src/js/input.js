// handle Key 
import { play, playChord, playToggle } from "./audio/audio1";
import { GameInit } from "./init";

function inRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
class Action {
  constructor(canvas,gamemap) {
    this.c = canvas;
    this.gamemap = gamemap;
    this.reset();
    
    ["keydown","keyup",
      ...( "ontouchstart" in window ? ["touchstart","touchend"] : ["mousedown","mouseup"] )
    ].forEach(ev => window.addEventListener(ev, e => this.handle(e)));
  }
  reset(){
    this.keyIn = {};
    this.keyUp = 0;
    this.keyEvent = 0;
  }
  pos(e) {
    let r = this.c.getBoundingClientRect();
    let p = e.touches?.[0] || e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }

  handle(e) {
    let k = e.which || 0, keytype = e.type;
    playChord()
     
    if (e.repeat) return;

    const allIdle = GameInit.cats.every(c => !c.moving);
    const somefall = GameInit.cats.find(c => c.fall);
    if(somefall)return;
    if (keytype == "keydown" && allIdle) this.keyIn[k] =1;
    if (keytype == "keyup") this.keyIn[k] = 0;

    if (keytype == "mousedown" || keytype == "touchstart") {

      if(this.keyUp)return;
      this.keyUp=1

      let p = this.pos(e);
      this.keyIn.mouse = { ...p};

      if (GameInit.state == 1 && GameInit.btn?.length) {
        for (let btn of GameInit.btn) {
          if (inRect(p.x, p.y, btn.x, btn.y, btn.w, btn.h)) {
            console.log("選擇關卡:", btn.t);
            GameInit.state = 2;
            GameInit.map.changelevel(btn.t);
            return; 
          }
        }
      }

      let { x, y, w, h, t } = GameInit.mbtn;

      if (inRect(p.x, p.y, x, y, w, h)){
        GameInit.mbtn = {}
        if (t===1){
          GameInit.state = 1;
        }
        if (t === 2) {
          console.log(GameInit.g)   
          if(GameInit.g)GameInit.g=0;
          GameInit.ti?GameInit.ti.isrun = 0:null;
          GameInit.state = 2;
          GameInit.map.changelevel(GameInit.level);
        }
        // next
        if (t === 3) {
          GameInit.ti!=null?GameInit.ti.isrun = 0:null;
          GameInit.map.changelevel(GameInit.level + 1);
        }
      }
    }

    if (keytype === "mouseup" || keytype === "touchend") {
      this.reset()
    }

    this.keyEvent = Object.values(this.keyIn).some(v => v === 1 || v?.active);

    if (GameInit.levelcleared!=0) {
      this.reset();
      return;
    }

    if (this.keyEvent && this.gamemap?.save && this.gamemap?.undo) {
      if (GameInit.moves[k] && allIdle) {
        this.gamemap.save();
        play(0)
        GameInit.item.forEach(e => e.plusmove());
      }
      if (k == 81) { // Q = undo
        this.gamemap.undo();
        console.log("Undo:");
      }
      if (k == 82){ // R = restart
        GameInit.restartLevel = 1
      }
      
      if (k==87){ // W = mute 
        playToggle()
      }
      if (k==69){ // e = Home
        GameInit.state=0
      }
    }
  }

  isDown(k){ 
    return this.keyIn[k]===1; 
  }

  hasInput(){ return !!this.keyEvent; }
}

export {Action}