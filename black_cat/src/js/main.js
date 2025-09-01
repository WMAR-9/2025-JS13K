import { Camera } from "./camera";
import { canvas, createC, createImg, ctx, getC, toPng } from "./canvas";
import { GameInit } from "./init";
import { Action } from "./input";
import { Msg } from "./msg/msg";
import { GameMap } from "./tile/map";
import { Tile } from "./tile/tileitem";
import { Timer } from "./timer";
import { TransitionEffect } from "./trans/transform";
import { Vector } from "./vector";
import blocks from '../img/all.png';
import { allPng } from "./assest/createAsset";
import { TypewriterSprite } from "./trans/typeing";


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
        return img
    });
    
    // start Game
    const [img] = await Promise.all([
      loadImage(blocks).then(img=>allPng(img))
    ]);

    // const tileSize = 10
    // canvas.width = img.width * tileSize;
    // canvas.height = img.height * tileSize;

    // const offCanvas = createC();
    // const offCtx = getC(offCanvas);
    // offCanvas.width = img.width;
    // offCanvas.height = img.height;
    // offCtx.drawImage(img, 0, 0);
    // const imageData = offCtx.getImageData(0, 0, img.width, img.height).data;

    // for (let y = 0; y < img.height; y++) {
    //     for (let x = 0; x < img.width; x++) {
    //         const idx = (y * img.width + x) * 4;
    //         const r = imageData[idx];
    //         const g = imageData[idx + 1];
    //         const b = imageData[idx + 2];
    //         const a = imageData[idx + 3] / 255;

    //         ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
    //         ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    //     }
    // }

    // const newImg = createImg();
    // newImg.src = toPng(canvas);
    // GameInit.image = [newImg];

    map.genMap()
}
let tw = new TypewriterSprite(
    "Story AFA\nwjti\nasdf\n  asdf\n love you cattie",             
    { cps: 3} 
);
const drawHomeMenu =_=> {
  tw.update()
}

const drawGame=()=>{
    
    if(GameInit.restartLevel)map.changelevel(GameInit.level);

    if(GameInit.cats.length>0){
      camera.follow(GameInit.cats[0].pos.clone())
    }else{
      camera.follow(new Vector(0,0))
    }
    
    // GameInit.item.map(e=>e.draw())
    GameInit.item.map(e=>{
      e.draw()
      e.update()
    })

 
    const allCatsStopped = GameInit.cats.every(e => e.moving==0);

    for (let cat of GameInit.cats){
        cat.update()
        cat.draw();
    }

    if (allCatsStopped) {
      GameInit.in = 0
      for (let cat of GameInit.cats)  cat.trigger();
      for (let cat of GameInit.cats)  cat.planMove(action);
      for (let cat of GameInit.cats)  cat.applyMove();
      
      if (!GameInit.levelcleared&&GameInit.cats.every(c => c.home === 1)) {
        
        if(!GameInit.transOn){
          GameInit.transOn = new TransitionEffect(1,100)
          GameInit.levelcleared = 1
          // map.changelevel(GameInit.level+1)
        }
      }
    }
    
    // GameInit.cats.map(e=>e.draw())
    if(GameInit.transOn){
      GameInit.transOn.update()
      if(!GameInit.transOn.isrun){
        if(GameInit.levelcleared){
          console.log("全部到家，進入下一關！");
          map.changelevel(GameInit.level+1)
        }
        GameInit.transOn = null
      }
    }
}

const gameLoop = _=>{
    
    GameInit.wwid = canvas.width = window.innerWidth
    GameInit.whei = canvas.height = window.innerHeight

    if(GameInit.state<2){
      drawHomeMenu()
    }else{
      drawGame()
    }
    requestAnimationFrame(gameLoop);
}


onresize=()=>{}

addEventListener("DOMContentLoaded",()=>initGame().then(gameLoop));