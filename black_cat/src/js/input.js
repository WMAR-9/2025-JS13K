// handle Key 
import { canvas } from "./canvas";

class Action{
    constructor(keys) {
    }

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
    event.preventDefault();
    const { x, y } = getMousePos(event);

}   

function handleMove(event) {
    event.preventDefault();
    const { x, y } = getMousePos(event);
}

function handleEnd() {
    
}


export {handleEnd,handleMove,handleStart}