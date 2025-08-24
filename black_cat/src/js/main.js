import { resetXY } from "./basic";
import { Camera } from "./camera";
import { canvas, ctx } from "./canvas";
import { Cat } from "./Cat";
import { GameInit } from "./init";
import { Action, handleEnd,handleStart } from "./input";
import { GameMap } from "./tile/map";
import { Tile } from "./tile/tileitem";
import { Timer } from "./timer";
import { Vector } from "./vector";


const map = new GameMap()
const action = new Action(canvas,map)

const camera = new Camera(new Vector(0,0))

const initGame =async ()=>{
    console.log("Start")
    const loadImage = src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
    map.genMap()
    const [playerImg, bgImg] = await Promise.all([
        
    ]);
}

const draw=()=>{
    if(GameInit.restartLevel)map.changelevel(GameInit.level);
    camera.update(0.01)

    //camera.follow(GameInit.cats[GameInit.cats.length-1].pos.clone())
    camera.draw()
    
    GameInit.item.map(e=>e.draw())
    GameInit.item.map(e=>{
      e.update()
    })
    for (let cat of GameInit.cats) cat.draw();
    // ctx.clearRect(-GameInit.window_width,-GameInit.window_height,GameInit.window_width,GameInit.window_height)
    let allCatsStopped = true;

    for (let cat of GameInit.cats) {
      if (cat.moving){
        allCatsStopped = false;
      }
      cat.update();
    }

    if (allCatsStopped) {
      for (let cat of GameInit.cats)  cat.trigger();
      for (let cat of GameInit.cats)  cat.planMove(action);
      for (let cat of GameInit.cats)  cat.applyMove();
      if (!GameInit.levelcleared&&GameInit.cats.every(c => c.home === 1)) {
        console.log("全部到家，進入下一關！");
        map.changelevel(GameInit.level+1)
      }
    }
    
    // GameInit.cats.map(e=>e.draw())

}
const gameLoop = _=>{
    
    GameInit.window_width = canvas.width = window.innerWidth
    GameInit.window_height = canvas.height = window.innerHeight
    draw()
    requestAnimationFrame(gameLoop);
}


onresize=()=>{}

addEventListener("DOMContentLoaded",()=>initGame().then(gameLoop));