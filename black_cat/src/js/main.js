import { canvas, ctx } from "./canvas";
import { Action, handleEnd,handleStart } from "./input";
import { Timer } from "./timer";

const action = new Action(canvas);
const mapW = 6, mapH = 6;
const tileW = 160;

function isoX(x,y) { return 800 + (x-y)*tileW/2; }
function isoY(x,y) { return 180 + (x+y)*tileW/4; }

const TYPE_EMOJI = ["", "🟥", "🟩", "🟦", "🟨", "⬛", "🚩", "🏁"];
const TYPE_COLOR = ["#6cf","#c33","#3c6","#36c","#fc3","#222","#fff","#0f0"];

class Tile {
  constructor(x, y, num, type, hidden) {
    this.x = x;
    this.y = y;
    this.num = num;
    this.type = type;
    this.hidden = hidden;
  }
  update(){return this}
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle="#FFF"
    ctx.moveTo(isoX(this.x, this.y), isoY(this.x, this.y));
    ctx.lineTo(isoX(this.x + 1, this.y), isoY(this.x + 1, this.y));
    ctx.lineTo(isoX(this.x + 1, this.y + 1), isoY(this.x + 1, this.y + 1));
    ctx.lineTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1));
    ctx.closePath();
    ctx.fillStyle = TYPE_COLOR[this.type];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    // 類型 emoji
    if (this.type !== 0) {
      ctx.font = "22px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(TYPE_EMOJI[this.type], isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) - 10);
    }
    // 數字或問號
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (this.type === 5 && this.hidden) {
      ctx.fillText("?", isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) + 10);
    } else {
      ctx.fillText(this.num, isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) + 10);
    }
    ctx.restore();
  }
}

class Player{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.lastKeys = {};
    }
    update(){
        const moves = {37: [-1,0], 38: [0,-1], 39: [1,0], 40: [0,1]};
  
        for (let k in moves) {
            if (action.isDown(k) && !this.lastKeys[k]) {
                this.x += moves[k][0];
                this.y += moves[k][1];
            }
        }

        this.lastKeys = {...action.keyIn};

        return this
    }
    draw(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.arc(isoX(this.x+0.5,this.y+0.5), isoY(this.x+0.5,this.y+0.5)-20, 18, 0, Math.PI*2);
        ctx.fillStyle = "#ffe066";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
    }
}

const TYPE = {
  NORMAL: 0,
  CURSE: 1,
  SAFE: 2,
  RESET: 3,
  CLONE: 4,
  HIDDEN: 5,
  START: 6,
  END: 7
};

function genMap() {
  let arr = [];
  for(let y=0;y<mapH;y++){
    let row=[];
    for(let x=0;x<mapW;x++){
      let t=TYPE.NORMAL;
      if(x===0&&y===0) t=TYPE.START;
      else if(x===mapW-1&&y===mapH-1) t=TYPE.END;
      else if(Math.random()<0.12) t=TYPE.CURSE;
      else if(Math.random()<0.10) t=TYPE.SAFE;
      else if(Math.random()<0.08) t=TYPE.RESET;
      else if(Math.random()<0.08) t=TYPE.CLONE;
      else if(Math.random()<0.08) t=TYPE.HIDDEN;
      row.push(t);
    }
    arr.push(row);
  }
  return arr;
}
function genNumMap() {
  let arr=[];
  for(let y=0;y<mapH;y++){
    let row=[];
    for(let x=0;x<mapW;x++){
      row.push(Math.floor(Math.random()*3));
    }
    arr.push(row);
  }
  arr[0][0]=0; arr[mapH-1][mapW-1]=0;
  return arr;
}

let typeMap = genMap();
let numMap = genNumMap();

let data = []

for(var i=0;i<typeMap.length;i++){
    for(var j=0;j<typeMap[i].length;j++){
        data.push(new Tile(i,j,numMap[i][j],typeMap[i][j]))
    }
}
data.push(new Player(0,0))

const initGame =async ()=>{
    console.log("Start")
    const loadImage = src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    const [playerImg, bgImg] = await Promise.all([
        
    ]);
}

const update=()=>{

}

const draw=()=>{
    data.map(e=>e.update().draw(ctx))
}

let lastTime = Timer.prototype.curTime();

const gameLoop = _=>{
    // Total Timer    
    let now = Timer.prototype.curTime();
    let dt = (now - lastTime) / 1000;
    lastTime = now
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    draw()
    requestAnimationFrame(gameLoop);
}


onresize=()=>{}

// canvas.onmousedown = (event) => handleEnd(event);
// canvas.onmousemove = (event) => handleMove(event);
// canvas.onmouseup = (event) => handleEnd(event);
// canvas.onmouseleave = (event) => handleEnd(event);

// canvas.ontouchstart = (event) => handleStart(event);
// canvas.ontouchmove = (event) => handleMove(event);
// canvas.ontouchend = (event) => handleEnd(event);
// canvas.ontouchcancel = (event) => handleEnd(event);

// canvas.onkeyup=(event)=> handleEnd(event);
// canvas.onkeydown=(event)=> handleMove(event);

addEventListener("DOMContentLoaded",()=>initGame().then(gameLoop));