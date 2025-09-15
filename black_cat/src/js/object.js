import { isoX, isoY } from "./basic";
import { Timer } from "./timer";
import { Vector } from "./vector";

class Item{
    constructor(x,y,w,h,height=0,kind=0,num=0,block=0){

        // pos
        this.x = x
        this.y = y
        this.targetpos = new Vector(x,y)
        this.prevpos = new Vector(x,y)
        this.pos = new Vector(isoX(x,y),isoY(x,y))
        this.spos = this.pos.clone()
        this.h = height

        // kind
        this.n = num
        this.b = block
        this.k = kind

        // direction
        this.dt = new Timer(1/60,1)

        this.timer = new Timer(1/60)
        
        // speed
        this.speed = 8

        // alpha
        this.a = 1
    }
    update(s){
       return this
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
    restoreXYZ(x, y, h,pos){
        this.x = x
        this.y = y
        this.h = h
        this.pos = pos.clone()
    }

    toData() {
        return {
        __class: "Item",
        x: this.x,
        y: this.y,
        h: this.h,
        k: this.k,
        n: this.n,
        b: this.b,
        pos: this.pos.toData(),
        targetpos: this.targetpos.toData(),
        prevpos: this.prevpos.toData(),
        spos: this.spos.toData()
        };
    }

    static fromData(data) {
        let item = new Item(data.x, data.y, 32, 32, data.h, data.k, data.n, data.b);
        item.pos = Vector.fromData(data.pos);
        item.targetpos = Vector.fromData(data.targetpos);
        item.prevpos = Vector.fromData(data.prevpos);
        item.spos = Vector.fromData(data.spos);
        return item;
    }
}

export {Item}