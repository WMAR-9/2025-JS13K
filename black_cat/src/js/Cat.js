import { max } from "./basic";
import { canvas, ctx } from "./canvas";
import { GameInit } from "./init";
import { Action } from "./input";
import { Item } from "./object";

const action = new Action(canvas);

class Cat extends Item {
    constructor(x, y, h, ba) {
        super(x, y, 32, 32, h, "C");
        this.id = ba
        this.lastKeys = {};
        this.moving = true;
        this.nextPos = null;
        this.h = GameInit.item.find(t => t.k=="w" && t.x === this.x && t.y === this.y).h;
    }
    planMove(){
      if (this.moving) return;
      const moves = { 37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1] };

        for (let k in moves) {
            if (action.isDown(k) && !this.lastKeys[k]) {
                let nx = this.x + moves[k][0];
                let ny = this.y + moves[k][1];

                let nextTile = GameInit.item.find(t => t.k=="w" && t.x === nx && t.y === ny);
                let curPlaceTile = GameInit.item.find(t => t.k=="w" && t.x === this.x && t.y === this.y);
                
                // keep the height of tile 
                this.h = max(curPlaceTile.h,this.h);

                if (!nextTile) continue;

                let dh = nextTile.h - this.h;
                if (dh > 1) continue;

                // height stack of cat
                let standingCats = GameInit.cats.filter(c => c !== this && c.x === this.x && c.y === this.y);
                let relH = 0;

                for (let i=0;i<standingCats.length;i++){
                  if (standingCats[i].h < this.h) relH++;
                }

                let targetH = nextTile.h<=this.h? nextTile.h+ relH : nextTile.h;

                this.nextPos = { x: nx, y: ny, h: targetH };
            }
        }

        this.lastKeys = { ...action.keyIn };
    }
    applyMove() {
        if (!this.nextPos) return;
        
        for(var cat of GameInit.cats){

          if(cat !== this &&
            cat.x === this.nextPos.x &&
            cat.y === this.nextPos.y &&
            !cat.nextPos
          ){
            if(this.h > cat.h){
              this.nextPos.h = cat.h + 1
              console.log("CAT APPLY MOVE other cat diff height :",this.id,cat.nextPos,this.nextPos)
            }else{
              console.log("CAT APPLY MOVE other cat in next tile:",this.id,cat.nextPos,this.nextPos)
              this.nextPos = null
              break
            }
          }

        }

        if (!this.nextPos) {
            return;
        }

        this.targetpos.setX(this.nextPos.x).setY(this.nextPos.y);
        this.h = this.nextPos.h;
        this.moving = true;
    }
    update() {
      if (this.moving) {
          let curTile = GameInit.item.find(t => t.k=="w" && t.x === this.targetpos.x && t.y === this.targetpos.y);
          let h = curTile ? curTile.h+10 : 0;
          let targetPos = this.targetpos.clone().add({x:0.5,y:0.5});
          targetPos.tranisoXY();
          
          targetPos.substractY(h + this.h*25);
      
          this.pos.add(targetPos.clone().substract(this.pos).devide(this.speed));
      
          if (Math.abs(targetPos.x - this.pos.x) < 1 && 
          Math.abs(targetPos.y - this.pos.y) < 1) {
            this.pos = targetPos.clone();
            this.x = this.targetpos.x;
            this.y = this.targetpos.y;
            this.moving = false;
            this.nextPos = null; // reset
          }
        }
        return this;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = this.id=="y" ?"#ffe066":"#ff0000";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(this.h, this.pos.x - 5, this.pos.y - 15);
    }
}

export {Cat}