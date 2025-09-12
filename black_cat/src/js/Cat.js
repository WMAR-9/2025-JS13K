import { play } from "./audio/audio1";
import { abs, floor, hypot, isoX, max, min } from "./basic";
import { ctx, dIso } from "./canvas";
import { GameInit } from "./init";
import { Msg } from "./msg/msg";
import { Item } from "./object";
import { Timer } from "./timer";
import { Vector } from "./vector";

class Cat extends Item {
    constructor(x, y, h,k) {
        super(x, y, 32, 32, h, k);
        this.keyIn = {};
        this.moving = 1;
        this.nextPos = null;

        // at home
        this.home = 0
        
        // cross
        this.fall = 0

        // img
        this.f = 0
        this.d = 0
        this.jump = 0
        this.dt.l = 0
        // idle time
        this.it = new Timer(1/150,1)
        // move msg
        this.msg = new Msg(x,y,0,this.k%5)
        
        this.isPa= 0
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
            if (GameInit.ac.isDown(k) && !this.keyIn[k]) {
                //reset msg
                this.msg.cm(0);

                this.d = k-36
                
                let nx = this.x + GameInit.moves[k][0];
                let ny = this.y + GameInit.moves[k][1];

                let nextTile = this.getTile(nx,ny)
                let curPlaceTile = this.getTile(this.x,this.y)

                if (!nextTile||!curPlaceTile){
                  // can't move 
                  this.isPa=1
                  this.msg.show(3)
                  continue;
                }
                
                // keep the height of tile 
                // this.h = max(curPlaceTile.h,this.h);

                let dh = nextTile.h - this.h;
                
                if (dh > 1){
                  // too high
                  this.isPa=1
                  this.msg.show(2)
                  continue;
                }
                
                // height stack of cat
                let standingCats = GameInit.cats.filter(c => c !== this && c.x == this.x && c.y == this.y && !c.isPa);
                console.log("CAT Standing CATS :",standingCats)
                let relH = 0;

                for (let cat of standingCats) {
                  if (cat.h < this.h) {
                    // console.log("Currnet : h ",cat.k,cat.h,cat.isPa)
                    let catTargetH = nextTile.h <= cat.h ? nextTile.h + relH : nextTile.h;
                    relH++;
                  }
                }
                console.log("CAT Standing status:",relH,nextTile.h,nextTile.h+relH,this.k,this.h)
                let targetH = nextTile.h<=this.h? nextTile.h + relH : nextTile.h;

                // check nextTile have block tunnel 
                let nextTunnel = this.getTunnel(nx,ny,targetH+1,this.k)
                
                if(nextTunnel){
                  // cant pass tunnel
                  this.isPa = 1
                  this.msg.show(8)
                  continue; 
                }
                let tileDirect =targetH-this.h
                if(tileDirect>=1){
                  this.jump = 1
                }
                if (tileDirect<0){
                  this.jump = 2
                }
                if (tileDirect==0){
                  this.jump = -1
                }

                this.nextPos = { x: nx, y: ny, h: targetH };
            }
        }

        this.keyIn = { ...GameInit.ac.keyIn };
    }
    applyMove() {
        if (!this.nextPos) return;

        let nx = this.nextPos.x
        let ny = this.nextPos.y
        // standing height
        let targetH = this.nextPos.h
        let nh = targetH
        let nextstandingCats = GameInit.cats.filter(c => c !== this && c.x == nx && c.y == ny && c.isPa);
        let conflict = 0;
        console.log("how many next standing cats",nextstandingCats)

        for (let cat of nextstandingCats){
          if (cat.h <= targetH) {
            // high to lower 
            if(this.h>cat.h){
              if(this.k==1)
                console.log("Next tile standing Cat",this.h,cat.h,targetH,this.h-cat.h)
              // this.nextPos.h = nextstandingCats.length + min(targetH,(this.h - cat.h));
              nh = nextstandingCats.length + max(min(targetH,(this.h - cat.h)),cat.h);
            }else{
              conflict=1
              this.isPa = 1
            }
          }else{
            console.log("APP MOVE HAVE SAME NX < NY")
            conflict=1
            this.isPa = 1
          }
        }

        if (conflict) {
            this.msg.show(4)
            this.nextPos = null
            return;
        }
        

        this.targetpos.setX(nx).setY(ny);
        this.h = nh;
        this.moving = 1;
    }
    update() {
      if (this.fall){
        this.timer.start()

        this.h -= this.h * this.timer.progress;

        this.pos.y += 10; 

        if(this.timer.e) {

          GameInit.restartLevel = 1

        }

      }else{
        if (this.moving) {
          //msg 
          this.msg.reset()
          this.it.reset()

          this.dt.start()
          let curTile = this.getTile(this.targetpos.x,this.targetpos.y)
          
          // tile direct
          if(this.dt.progress<.3){
            this.f = 2
            return;
          }

          let h = curTile ? curTile.h+GameInit.tileW/20 : 0;
          let targetPos = this.targetpos.clone().add({x:0.5,y:0.5});
          
          targetPos.tranisoXY().substractY(h + this.h*GameInit.tileW/4.7);
          
          this.pos.add(targetPos.clone().substract(this.pos).devide(this.speed));
          
          // let dist = hypot(targetPos.x - this.pos.x, targetPos.y - this.pos.y);
          // let totalDist = hypot(targetPos.x - this.spos.x, targetPos.y - this.spos.y);
          // let percent = totalDist ? 1 - dist / totalDist : 1; 
          
          // moving with ani
          let p = this.dt.progress;
          let states = [-2, -1, -2, -1];
          let index = floor(p * 4);
          if(this.jump<0)this.jump = states[index];

          this.f = 2 + this.jump


          if (abs(targetPos.x - this.pos.x) < 1 && 
          abs(targetPos.y - this.pos.y) < 1) {
            this.pos = targetPos.clone();
            this.spos = targetPos.clone();
            this.x = this.targetpos.x;
            this.y = this.targetpos.y;
            this.moving = 0;
            this.nextPos = null; // reset
            this.f = 0
            this.dt.reset()
          }
        }else{
          this.it.start()
          if(this.it.progress>.7){
            let p = this.it.progress;
            let states = [1, 0,1,0];
            let index = floor(p * 3);
            this.d = 0
            this.f = states[index]
            this.msg.active=1
          }
        }
      }
      return;
    }

    trigger(){
      // message 
      this.isPa = 0
      this.msg.changeXY(this.pos);
      
      this.msg.draw()

      // tile function
      this.home = 0
      const tileType = this.getTile(this.x,this.y)
      if(!tileType)return;

      // Home,Zero,cross,Hidden tiles
      if(tileType.k - tileType.ty == this.k){

        // home tile
        if(tileType.k>=1 && tileType.k<=5){
          this.home = 1
          this.msg.show(1)
        }

        // zero tile
        if(tileType.k>=6&&tileType.k<=10 && !tileType.zeroBtn && this.h == tileType.h){
          GameInit.item.map(e=>(e.k==0 || (e.k>=16&&e.k<=20) || (e.x==tileType.x && e.y==tileType.y) )?e.resetzero():0)
          this.msg.show(7)
          play(1)
        }

        // cross tile
        if(tileType.k>=11&&tileType.k<=15){
          if(tileType.h==this.h){
            this.msg.show(6)
            GameInit.cats.map(c =>{
              if(c.x === this.x && c.y === this.y){
                c.fall = 1
                c.f = 3
              }
            });
            play(4)
            tileType.destory()
          }
        }

        // hidden tile
        if(tileType.k>=16&&tileType.k<=20 && this.h == tileType.h){
          this.msg.show(9,String(max(14-tileType.n,0)))
          tileType.openTile()
        }

        //change tile
      }else if(tileType.k>=21&&tileType.k<=25){
          
        if(this.h==tileType.h){
          
          let changeCat = GameInit.cats.find(cat=>cat.k==tileType.k-tileType.ty && cat != this)

          if(!changeCat)return;
          this.msg.show(5)
          let tmp = changeCat.toData()
          changeCat.restoreXYZ(this.x,this.y,this.h,this.pos)
          this.restoreXYZ(tmp.x,tmp.y,tmp.h,new Vector(tmp.pos.x,tmp.pos.y))
          play(3)
        }
      }
    }
    isMask() {
      let no = 0  
      GameInit.item.some(i => {    
          if(i !== this &&
            i.x >= this.x &&
            i.x <= this.x+1 &&
            i.y >= this.y &&
            i.y <= this.y+1 &&
            i.h > this.h+1){
              i.a = .3
              no=1
          }else if(i!==this&& i.b==1 && i.x == this.x &&
            i.y == this.y && this.h+1==i.h){
            no=1
          }else{
            i.a = 1
          }
        }
      );
      return no
    }
    draw() {

        ctx.save();

        if(this.isMask()){
          ctx.globalCompositeOperation = "overlay";  
        }else{
          ctx.globalCompositeOperation = "source-over";  
        }
        const baseSize = GameInit.tileW/2.5

        dIso(GameInit.ic[this.d][this.f][this.k-1],0,baseSize,this.pos.x,this.pos.y-baseSize/10,1,0,0,1);

        ctx.restore();
    }
    resize(){
      let curTile = this.getTile(this.x, this.y);
      let h = (curTile?.h ?? 0) + GameInit.tileW / 20;
      this.pos = this.targetpos.clone().add({ x: 0.5, y: 0.5 }).tranisoXY().substractY(h + this.h * GameInit.tileW / 5);
    }
    toData() {
      return {
        ...super.toData(),
        __class: "Cat",
        keyIn: this.keyIn,
        moving: this.moving,
        nextPos: this.nextPos,
        home: this.home,
        fall: this.fall,
        f: this.f
      };
    }

    static fromData(data) {
      let cat = new Cat(data.x, data.y, data.h, data.k);
      Object.assign(cat, super.fromData(data), {
        keyIn: data.keyIn,
        moving: data.moving,
        nextPos: data.nextPos,
        home: data.home,
        fall: data.fall,
        f: data.f
      });
      return cat;
    }
}

export {Cat}