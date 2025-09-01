import { max } from "./basic";
import { canvas, ctx } from "./canvas";
import { GameInit } from "./init";
import { Action } from "./input";
import { Msg } from "./msg/msg";
import { Item } from "./object";
import { Vector } from "./vector";

const action = new Action(canvas);

class Cat extends Item {
    constructor(x, y, h,k) {
        super(x, y, 32, 32, h, k);
        this.lastKeys = {};
        this.moving = 1;
        this.nextPos = null;

        // at home
        this.home = 0
        
        // 
        this.fall = 0
        this.failFrame = 0

        // move msg
        this.msg = new Msg(x,y,"meow")
    }
    getTile(x,y){
      return GameInit.tileTable[`${x},${y}`]
    }
    getTunnel(x,y,h,k){
      return GameInit.tileTable[`${x},${y},${h},${k}`]
    }

    planMove(){
      if (this.moving) return;

        for (let k in GameInit.moves) {
            if (action.isDown(k) && !this.lastKeys[k]) {
                let nx = this.x + GameInit.moves[k][0];
                let ny = this.y + GameInit.moves[k][1];

                let nextTile = this.getTile(nx,ny)
                let curPlaceTile = this.getTile(this.x,this.y)
                if (!nextTile||!curPlaceTile){
                  this.msg.show()
                  continue;
                }
                
                // keep the height of tile 
                this.h = max(curPlaceTile.h,this.h);

                let dh = nextTile.h - this.h;
                if (dh > 1){
                  this.msg.show()
                  continue;
                }

                
                // height stack of cat
                let standingCats = GameInit.cats.filter(c => c !== this && c.x === this.x && c.y === this.y);
                let relH = 0;

                for (let cat of standingCats) {
                  if (cat.h < this.h) {
                    
                    let catTargetH = nextTile.h <= cat.h ? nextTile.h + relH : nextTile.h;
                    let blockTunnel = this.getTunnel(nx, ny, catTargetH + 1, cat.k);

                    if (!blockTunnel) {
                      relH++;
                    }
                  }
                }

                let targetH = nextTile.h<=this.h? nextTile.h + relH : nextTile.h;

                // check nextTile have block tunnel 
                let nextTunnel = this.getTunnel(nx,ny,targetH+1,this.k)
                if(nextTunnel){
                  this.msg.show()
                  continue; 
                }
                
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
        this.moving = 1;
    }
    update() {
      if (this.fall){
        this.failFrame ++
        const fallDuration = 60;

        this.h = this.h - (this.h / fallDuration) * this.failFrame;

        this.pos.y += 10; 

        if(this.failFrame >= fallDuration) {

          GameInit.restartLevel = 1

        }

      }else{
        if (this.moving) {
          //msg 
          this.msg.reset()

          let curTile = this.getTile(this.targetpos.x,this.targetpos.y)

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
            this.moving = 0;
            this.nextPos = null; // reset
          }
        }
      }
      return this;
    }

    trigger(){
      // message 
      this.msg.changeXY(this.pos);

      if (!this.msg.active && Math.random() < 0.3) {
        this.msg.active = 1;
      }else{
        this.msg.draw()
      }

      // tile function
      this.home = 0
      const tileType = this.getTile(this.x,this.y)
      if(!tileType)return

      // Home,Zero,cross,Hidden tiles
      if(tileType.k - tileType.ty == this.k){
        // console.log(`index ${this.k} start check`)
        // console.log(`Tile index ${tileType.k},${tileType.type} start check`)
        
        // home tile
        if(tileType.k>=1 && tileType.k<=5){
          this.home = 1
          this.msg.show()
        }

        // zero tile
        if(tileType.k>=6&&tileType.k<=10 && !tileType.zeroBtn){
          GameInit.item.map(e=>(e.k==0 || (e.k>=16&&e.k<=20) || (e.x==tileType.x && e.y==tileType.y) )?e.resetzero():0)
        }

        // cross tile
        if(tileType.k>=11&&tileType.k<=15){
          if(tileType.h==this.h){

            GameInit.cats.map(c =>{
              if(c.x === this.x && c.y === this.y) c.fall = 1
            });
            tileType.destory()
          }
        }

        // hidden tile
        if(tileType.k>=16&&tileType.k<=20){
          tileType.openTile()
        }

        //change tile
      }else if(tileType.k>=21&&tileType.k<=25){
          
        if(this.h==tileType.h){
          
          let changeCat = GameInit.cats.find(cat=>cat.k==tileType.k-tileType.ty && cat != this)

          if(!changeCat)return;

          let tmp = changeCat.toData()
          changeCat.restoreXYZ(this.x,this.y,this.h,this.pos)
          this.restoreXYZ(tmp.x,tmp.y,tmp.h,new Vector(tmp.pos.x,tmp.pos.y))

        }
      }
    }
    isMask() {
        return GameInit.item.some(i => 
            i !== this &&
            i.x >= this.x &&
            i.x <= this.x+1 &&
            i.y >= this.y &&
            i.y <= this.y+1 &&
            i.h > this.h+1
        );
    }
    draw() {

        ctx.save();
        
        ctx.beginPath();

        if(this.isMask()){
          ctx.globalCompositeOperation = "lighter";  
          ctx.globalAlpha = 0.5;
        }else{
          ctx.globalCompositeOperation = "source-over";  
          ctx.globalAlpha = 1;
        }
        
        ctx.arc(this.pos.x, this.pos.y, 12, 0, Math.PI * 2);
        
        ctx.fillStyle = `#${GameInit.theme.surC[this.k]}`;
        ctx.fill();

        ctx.closePath();
        ctx.restore();
    }
    
    toData() {
      return {
        ...super.toData(),
        __class: "Cat",
        lastKeys: this.lastKeys,
        moving: this.moving,
        nextPos: this.nextPos,
        home: this.home,
        fall: this.fall,
        failFrame: this.failFrame
      };
    }

    static fromData(data) {
      let cat = new Cat(data.x, data.y, data.h, data.k);
      Object.assign(cat, super.fromData(data), {
        lastKeys: data.lastKeys,
        moving: data.moving,
        nextPos: data.nextPos,
        home: data.home,
        fall: data.fall,
        failFrame: data.failFrame
      });
      return cat;
    }
}

export {Cat}