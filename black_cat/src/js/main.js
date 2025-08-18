import { canvas } from "./canvas";
import { handleEnd,handleMove,handleStart } from "./input";
import { Timer } from "./timer";






let lastTime = Timer.prototype.curTime();

const gameLoop = _=>{
    let now = Timer.prototype.curTime();
    let dt = (now - lastTime) / 1000;
    lastTime = now
        
    requestAnimationFrame(gameLoop);
}

gameLoop();

onresize=()=>{}

canvas.onmousedown = (event) => handleEnd(event);
canvas.onmousemove = (event) => handleMove(event);
canvas.onmouseup = (event) => handleEnd(event);
canvas.onmouseleave = (event) => handleEnd(event);

canvas.ontouchstart = (event) => handleStart(event);
canvas.ontouchmove = (event) => handleMove(event);
canvas.ontouchend = (event) => handleEnd(event);
canvas.ontouchcancel = (event) => handleEnd(event);

