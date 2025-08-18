// handle Key 
import { canvas } from "./canvas";

class Action {
  constructor(canvas) {
    this.c = canvas;
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
    e.preventDefault();
    let k = e.which||0, t = e.type;
    console.log(k)
    if (t==="keydown"){
        this.keyIn[k]=1;
    }
    if (t==="keyup"){
        this.keyIn[k]=0;
    }
    if (t==="mousedown"||t==="touchstart") this.keyIn.mouse={...this.pos(e),active:1};
    if (t==="mouseup"||t==="touchend") this.keyIn.mouse={...this.keyIn.mouse,active:0};
    this.keyEvent = Object.values(this.keyIn).some(v=>v===1||v?.active);
  }

  isDown(k){ return this.keyIn[k]===1; }
  hasInput(){ return !!this.keyEvent; }
}

function getMousePos(event) {

    if (event.clientX && event.clientY) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }
    //
    if (event.touches && event.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.touches[0].clientX - rect.left,
            y: event.touches[0].clientY - rect.top
        };
    }

    return { x: 0, y: 0 };
}

function handleStart(event) {
    var i = event.which;
    event.preventDefault();
    const { x, y } = getMousePos(event);
    var a=[1,37,38,39,40,32];
    KeyEvent=a.indexOf(i)?1:0;
    KeyIn[i]=1;
}   

function handleEnd(event) {
    let i = event.which
    KeyIn[i]=0;
    KeyEvent=KeyIn.some(e=>e!=0)?1:0;
}


export {handleEnd,handleStart,Action}