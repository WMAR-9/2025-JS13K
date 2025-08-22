import { isoX, isoY } from "./basic";
import { Timer } from "./timer";
import { Vector } from "./vector";

class Item{
    constructor(x,y,w,h,height=0,kind=0){

        this.x = x
        this.y = y
        this.targetpos = new Vector(x,y)
        this.prevpos = new Vector(x,y)
        this.pos = new Vector(isoX(x,y),isoY(x,y))
        this.spos = this.pos.clone()
        
        this.h = height
        
        // direction
        this.dtimer = new Timer(0.1,1)
        
        // type
        this.k = kind

        this.timer = new Timer()

        this.speed = 8
    }
    update(s){
        this.draw()
    }
    draw(){}
    isMouseOver(mouseX, mouseY) {
        return mouseX > this.pos.x && mouseX < this.pos.x + this.pos.w &&
               mouseY > this.pos.y && mouseY < this.pos.y + this.pos.h;
    }
    resize(){
        this.spos = this.pos.clone()
        this.prevpos = this.pos.clone()
    }
}

export {Item}