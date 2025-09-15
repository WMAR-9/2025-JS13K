import { Camera } from "./camera";
import { canvas, ctx, dIso} from "./canvas";
import { GameInit } from "./init";
import { Action } from "./input";
import { GameMap } from "./tile/map";
import { TransitionEffect } from "./trans/transform";
import { Vector } from "./vector";
import blocks from '../img/t.png';
import { allPng } from "./assest/createAsset";
import { TypewriterSprite } from "./trans/typeing";
import { minimap } from "./tile/littlemap";
import { floor, localGet, localSet, max, min, rand } from "./basic";
import { Timer } from "./timer";
import { Cat } from "./Cat";
import { play } from "./audio/audio1";


GameInit.map = new GameMap()
GameInit.ac = new Action(canvas,GameInit.map)
GameInit.memap = localGet("CAT") ? JSON.parse(localGet("CAT")) : Array(GameInit.maxLevel+1).fill(0)

const camera = new Camera(new Vector(0,0))
let menuT = new Timer(1/60,1)
let cat = null

const initGame =async ()=>{
    console.log("Start")
    const loadImage = src => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = _ => resolve(img);
        img.onerror = reject;
        img.src = src;
        return img
    });
    
    // start create Image
    console.log(GameInit.memap)
    const img = await loadImage(blocks)
    await allPng(img)
    
}

async function showLoaderAndInit({ minTime = 10000, fadeTime = 1000 } = {}) {
  const loading = document.getElementById("l");
  const bar = loading.querySelector(".p");
  const text = loading.querySelector(".t");

  loading.style.setProperty("--fade-time", fadeTime + "ms");
  loading.classList.remove("hidden");
  
  
  let progress = 0;
  const timer = setInterval(() => {
    bar.style.width = (progress = min(progress + rand(10), 100)) + "%";
    text.textContent = floor(progress) + "%";
    if (progress >= 100) clearInterval(timer);
  }, 200);
  await Promise.all([initGame(), new Promise(r => setTimeout(r, minTime))]);
  clearInterval(timer);
  bar.style.width = "100%";
  text.textContent = "100%";
  return new Promise(res => {
    loading.addEventListener("transitionend", () => res(gameLoop()), { once: true });
    loading.classList.add("hidden");
  });
}


const drawMenu =_=> {
    
    ctx.save();
    GameInit.btn = []
    menuT.start()
    const w = GameInit.wwid/2,h = GameInit.whei/2,tileW=GameInit.tileW/2.5
    const padding = tileW/1.5
    let _ch = "choose"
    let titleWidth = _ch.length * padding;
    let startX = w - titleWidth / 2, y = padding;
    for (let i = 0; i < _ch.length; i++) {
        dIso(GameInit.f[_ch[i]][2], 0, padding, startX+tileW/2, y);
        startX += padding;
    }
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const idx = row * 4 + col;
            const x = w - (tileW * 2+padding*1.5) + col * (tileW+padding);
            const y = h - (tileW * 2+padding*1.5) + row * (tileW+padding);
            
            if(GameInit.memap[idx]){
              // console.log(idx)
              ctx.globalAlpha=0.5
            }else{
              ctx.globalAlpha=1
            }

            ctx.fillStyle = "#888";
            ctx.fillRect(x, y, tileW, tileW);
            
            GameInit.btn.push({t:idx,x,y,w:tileW,h:tileW})

            dIso(GameInit.ig[1][4],0,tileW,x,y,1,0,1,1);
            
            const count = min(row + 1,2);
            // const count = row + 1;
            const step = tileW / count;  
            const offset = x + tileW / 2;

            for (let i = 0; i < count; i++) {
              const px = offset - (step * (count - 1) / 2) + i * step;
              dIso(GameInit.ic[2][menuT.progress>.5?3:2][i], 0, step, px, y + tileW / 4, 1, 0, 1, 1);
            }
            _ch = (idx+1)+""
            for(let i=0;i<_ch.length;i++){
              const px = offset - (tileW/4 * (_ch.length - 1) / 2) + i * tileW/4;
              dIso(GameInit.f[_ch[i]][2], 0, tileW/2.5, px, y + tileW / 1.5, 1, 0, 1, 1);
            }
        }
    }

    ctx.restore();
}

const drawHome = _ => {
  menuT.start()
  const h = GameInit.whei
  const w = GameInit.wwid
  ctx.save();
  ctx.fillStyle = "#002";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#fea";
  ctx.beginPath();
  ctx.arc(w - 120 - camera.pos.x * 0.2, 100, 40, 0, Math.PI * 2);
  ctx.fill();

  const groundY = h - 80;
  ctx.fillStyle = "#111";
  ctx.fillRect(0, groundY, w, h - groundY);

  ctx.fillStyle = "#222";
  ctx.fillRect(0, groundY + 20, w, 60);

  ctx.strokeStyle = "#ffec80";
  ctx.lineWidth = 4;
  ctx.setLineDash([30, 30]);
  ctx.beginPath();
  let lineOffset = camera.pos.x % 60;
  ctx.moveTo(-lineOffset, groundY + 50);
  ctx.lineTo(w - lineOffset, groundY + 50);
  ctx.stroke();
  ctx.setLineDash([]);

  let lampSpacing = 200;
  let lampOffset = camera.pos.x % lampSpacing;
  for (let i = -lampOffset; i < w + lampSpacing; i += lampSpacing) {
    ctx.fillStyle = "#222";
    ctx.fillRect(i, groundY - 60, 6, 80);
    ctx.beginPath();
    ctx.arc(i + 3, groundY - 70, 15, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,240,180,0.6)";
    ctx.fill();
  }
  if(cat!=null){
    let catDrawX = cat.pos.x - camera.pos.x;
    cat.pos.setX(catDrawX);
    cat.pos.setY(groundY + 50);
    cat.pos.setX(w / 2);
    cat.d=3
    cat.f=menuT.progress<0.3?2:3
    cat.draw()
    camera.pos.x+=1
  }
  const tileW = GameInit.tileW / 2.5;
  const title = GameInit.title;
  const startBTN = "tap to start";
  const titleSize = tileW;

  function drawCenterText(str, y, size, s = 0, color = 0) {
    let width = str.length*size*.8;
    let x = w / 2 - width / 2;
    for (let i = 0; i < str.length; i++) {
      if (str[i] == " ") { x += size / 2; continue; }
      dIso(GameInit.f[str[i]][color], 0, size, x, y, s, s, menuT.progress * 6, 1);
      x += size;
    }
  }

  drawCenterText(title, h/3, titleSize,0,3);

  drawCenterText(startBTN, h/1.5, titleSize * 0.3,1,2);

  GameInit.mbtn = {
    t: 1,
    x: 0,
    y: 0,
    w: w,
    h: h
  };

  if(camera.pos.x<-h)camera.pos.x=0
  ctx.restore();
};

const drawGame=()=>{

    if(GameInit.g){
      GameInit.g.update()
      return;
    }

    minimap()
    if(GameInit.restartLevel)GameInit.map.changelevel(GameInit.level);

    if(GameInit.cats.length>0){
      camera.follow(GameInit.cats[0].pos.clone())
    }else{
      camera.follow(new Vector(0,0))
    }

      GameInit.cats.sort((a, b) => {
        let tempKey = GameInit.ac.keyIn
        if(tempKey[37]){
          return a.x - b.x;
        }
        if(tempKey[38]){
          return a.y - b.y;
        }
        if(tempKey[39]){
          return b.x - a.x;
        }
        if(tempKey[40]){
          return b.y - a.y;
        }
        return a.h-b.h
      });

    GameInit.item.map(e=>{
      e.draw()
      e.update()
    })

 
    const allCatsStopped = GameInit.cats.every(e => e.moving==0);
    
    let groups = {};
    for (let cat of GameInit.cats){
        cat.update()
        cat.draw()
        let key = `${cat.x},${cat.y}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(cat);
    }

    if (allCatsStopped) {
      GameInit.in = 0
      for (let cat of GameInit.cats)  cat.trigger();
      for (let cat of GameInit.cats)  cat.planMove();
      for (let cat of GameInit.cats)  cat.applyMove();
      
      if (GameInit.levelcleared==0&&GameInit.cats.every(c => c.home === 1)) {
        
        if(!GameInit.transOn){
          GameInit.transOn = new TransitionEffect(1,100)
          GameInit.levelcleared = 1
        }

      }else{
        let v = 0
        GameInit.item.map(c =>{
          if(c.islose()){
            c.hidden=0
            v = c.islose()  
          }
        })
        if(!GameInit.ti&&v){
          if(!GameInit.transOn){
            console.log("cretae LOSE animation")
            GameInit.transOn = new TransitionEffect(1)
            GameInit.levelcleared = -1
          }
        }
      }
    }
    // for (let key in groups) {
    //   let stack = groups[key];
    //   if(stack.every(e => !e.moving)){

    //         let sorted = [...stack].sort((a, b) => a.h - b.h);

    //         let hasGap = false;
    //         for (let i = 1; i < sorted.length; i++) {
    //           if (sorted[i].h !== sorted[i - 1].h + 1) {
    //             hasGap = true;
    //             break;
    //           }
    //         }

    //         if (hasGap) {
              
    //           let baseH = sorted[0].h;
    //           console.log("HERE",baseH)
    //           for (let i = 0; i < sorted.length; i++) {
    //             console.log("sort CAT:",sorted[i].h)
    //             let temp = sorted[i].h
    //             sorted[i].h = baseH + i;
    //             sorted[i].pos.y += (temp-sorted[i].h) * GameInit.tileW/5
    //             console.log("sorted CAT:",sorted[i].h)
    //           }
    //         }
    //     }
    // }
    // GameInit.cats.map(e=>e.draw())
    if(GameInit.transOn){
      GameInit.transOn.update()
      if(!GameInit.transOn.isrun){
        if(GameInit.levelcleared==1){
          play(5)
          GameInit.ti = new TypewriterSprite(1,{f:4})
          GameInit.memap[GameInit.level] = 1
          localSet("CAT",GameInit.memap)
        }
        if(GameInit.levelcleared == -1){
          console.log("Lose typing.....")
          GameInit.ti = new TypewriterSprite(0,{f:3})
        }
        GameInit.transOn = 0
      }
    }

    if(GameInit.ti){
      if(!GameInit.ti.isrun){
        GameInit.ti=0
      }else{
        GameInit.ti.update()
      }
    }

}

const gameLoop = _=>{
    
    GameInit.wwid = canvas.width = window.innerWidth
    GameInit.whei = canvas.height = window.innerHeight
    
    if(GameInit.state<2){
      onresize()
      if(GameInit.state===1){
        drawMenu()
      }else{
        drawHome() 
      }
    }else{
      drawGame()
    }

    requestAnimationFrame(gameLoop);
}

onresize=()=>{
  GameInit.wwid = canvas.width = window.innerWidth
  GameInit.whei = canvas.height = window.innerHeight
  const w = window.innerWidth;
  GameInit.tileW = max(100, min(300, floor(w / 8)));
  GameInit.cats.map(c=>c.resize())
}


addEventListener("DOMContentLoaded", async () => {
  await showLoaderAndInit({ minTime: 5000, fadeTime: 1500 });
  cat = new Cat(0,0,1,1)
  GameInit.g = new TypewriterSprite(0,{f:3,d:1})
  console.log("finish..init")

});

// addEventListener("DOMContentLoaded",async ()=>{
//   await initGame()
//   console.log("finish.. init")
//   cat = new Cat(0,0,1,1)
//   gameLoop()
// });