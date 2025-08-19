import { resetXY } from "./basic";
import { Camera } from "./camera";
import { canvas, ctx } from "./canvas";
import { Action, handleEnd,handleStart } from "./input";
import { Timer } from "./timer";
import { Vector } from "./vector";

const action = new Action(canvas);

const mapW = 10, mapH = 5;
const tileW = 160;

function isoX(x,y) { return (x-y)*tileW/2; }
function isoY(x,y) { return (x+y)*tileW/4; }

const TYPE_EMOJI = ["", "🟥", "🟩", "🟦", "🟨", "⬛", "🚩", "🏁"];
const TYPE_COLOR = ["#6cf","#c33","#3c6","#36c","#fc3","#222","#fff","#0f0"];
function shadeColor(color, amount) {
  let col = parseInt(color.slice(1), 16);
  let r = (col >> 16) + amount;
  let g = ((col >> 8) & 0x00FF) + amount;
  let b = (col & 0x0000FF) + amount;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `rgb(${r},${g},${b})`;
}
class Tile {
  constructor(x, y, num, type, hidden,height=0) {
    this.x = x;
    this.y = y;
    this.num = num;
    this.type = type;
    this.hidden = hidden;
    this.height = height
  }
  update(){return this}
  draw(ctx) {
    const h = this.height * 25
    
    ctx.beginPath();
    ctx.fillStyle="#FFF"
    ctx.moveTo(isoX(this.x, this.y), isoY(this.x, this.y) - h);
    ctx.lineTo(isoX(this.x + 1, this.y), isoY(this.x + 1, this.y) - h);
    ctx.lineTo(isoX(this.x + 1, this.y + 1), isoY(this.x + 1, this.y + 1) - h);
    ctx.lineTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1) - h);
    ctx.closePath();
    ctx.fillStyle = TYPE_COLOR[this.type];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1)-h);
    ctx.lineTo(isoX(this.x + 1, this.y+2), isoY(this.x + 1, this.y+2));
    ctx.lineTo(isoX(this.x + 2, this.y+2), isoY(this.x + 2, this.y+2));
    ctx.lineTo(isoX(this.x + 1, this.y+1), isoY(this.x + 1, this.y+1)-h);
    ctx.closePath();
    ctx.fillStyle = shadeColor(TYPE_COLOR[this.type],-20);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(isoX(this.x + 1, this.y+1), isoY(this.x + 1, this.y+1)-h);
    ctx.lineTo(isoX(this.x + 2, this.y+2), isoY(this.x + 2, this.y+2));
    ctx.lineTo(isoX(this.x + 2, this.y+1), isoY(this.x + 2, this.y+1));
    ctx.lineTo(isoX(this.x + 1 , this.y), isoY(this.x + 1, this.y)-h);
    ctx.closePath();
    ctx.fillStyle = shadeColor(TYPE_COLOR[this.type],-40);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (this.type !== 0) {
      ctx.font = "22px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(TYPE_EMOJI[this.type], isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) - h - 10);
    }
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(this.num, isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) - h + 10);
  }
}

class Player{
    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.pos =  new Vector(resetXY(isoX(this.x+0.5,this.y+0.5),isoY(this.x+0.5,this.y+0.5)-20))
        this.lastKeys = {};
    }
    update() {
      const moves = {37: [-1,0], 38: [0,-1], 39: [1,0], 40: [0,1]};
      for (let k in moves) {
        if (action.isDown(k) && !this.lastKeys[k]) {
          let nx = this.x + moves[k][0];
          let ny = this.y + moves[k][1];

  
          if (nx < 0 || ny < 0 || nx >= mapW || ny >= mapH) continue;

          let nextTile = data.find(t => t instanceof Tile && t.x === nx && t.y === ny);
          let curTile = data.find(t => t instanceof Tile && t.x === this.x && t.y === this.y);
          if (!nextTile) continue;

          let dh = nextTile.height - curTile.height;
          if (Math.abs(dh) > 1) continue;

          if (nextTile.type === TYPE.CURSE) continue; 

          this.x = nx;
          this.y = ny;
        }
      }
      let curTile = data.find(t => t instanceof Tile && t.x === this.x && t.y === this.y);

      let h = curTile ? curTile.height * 25 : 0;
      this.pos = new Vector(
        resetXY(
          isoX(this.x + 0.5, this.y + 0.5),
          isoY(this.x + 0.5, this.y + 0.5) - h - 25 
        )
      );
      this.lastKeys = {...action.keyIn};
      return this;
    }
    draw(ctx){
        
        ctx.beginPath();
        ctx.arc(this.pos.pos.x, this.pos.pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#ffe066";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 10;
        ctx.fill();
        
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
function genHeightMap() {
  let arr = [];
  for (let y = 0; y < mapH; y++) {
    let row = [];
    for (let x = 0; x < mapW; x++) {
      row.push(Math.floor(Math.random() * 3)); 
    }
    arr.push(row);
  }
  return arr;
}

let heightMap = genHeightMap();
let typeMap = genMap();
let numMap = genNumMap();

let data = []

for(var i=0;i<typeMap.length;i++){
    for(var j=0;j<typeMap[i].length;j++){
        data.push(new Tile(i,j,numMap[i][j],typeMap[i][j],0,heightMap[i][j]))
    }
}

const camera = new Camera(new Vector(resetXY(0,0)))

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

let last = performance.now();

const draw=()=>{
    
    camera.update(0.01)
    data.map(e=>e.update())
    camera.follow(data[data.length-1].pos.clone())
    ctx.save()
    camera.draw()
    data.map(e=>e.draw(ctx))
    ctx.restore()
}

let lastTime = Timer.prototype.curTime();

const gameLoop = _=>{
    
    let now = Timer.prototype.curTime();
    let dt = (now - lastTime) / 1000;
    lastTime = now
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    draw()
    requestAnimationFrame(gameLoop);
}


onresize=()=>{}

addEventListener("DOMContentLoaded",()=>initGame().then(gameLoop));