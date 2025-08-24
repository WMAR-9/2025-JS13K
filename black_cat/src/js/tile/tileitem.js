import { floor, isoX, isoY } from "../basic";
import { canvas, ctx } from "../canvas";
import { GameInit } from "../init";
import { Item } from "../object";

class Tile extends Item {
    constructor(x, y, h, k, num=0,block=0) {
        super(x, y, 32, 32, h, k,num,block);
        
        // num have two use 1.count 2. type of cat 
        this.hiddenTile()
        // zero only once 
        this.zeroBtn = 0
        
        // type divide
        if(k!=0&&block==0)this.type = floor((k - 1) / 5) * 5
        else this.type = 0

        //cross 
        this.fragments = null;
        this.broken = 0;

        // block box
        this.canMove=0
    }
    toData() {
        return {
        ...super.toData(),
        __class: "Tile",
        zeroBtn: this.zeroBtn,
        type: this.type,
        hidden: this.hidden,
        fragments: this.fragments,
        broken: this.broken,
        canMove: this.canMove
        };
    }

    static fromData(data) {
        let tile = new Tile(data.x, data.y, data.h, data.k, data.n, data.b);
        Object.assign(tile, super.fromData(data), {
        zeroBtn: data.zeroBtn,
        type: data.type,
        hidden: data.hidden,
        fragments: data.fragments,
        broken: data.broken,
        canMove: data.canMove
        });
        return tile;
    }
    // zero tile 
    resetzero(){
        if(this.zeroBtn)return;
        this.n = this.k==0 || (this.k>=16&&this.k<=20) ? 0:this.n;
        this.zeroBtn = 1
    }
    
    // default plus 1
    plusmove(){
        if(this.k==0 || (this.k>=16&&this.k<=20))this.n++;
    }

    // hidden tile
    openTile(){
        this.hidden=0
    }
    hiddenTile(){
        this.hidden = this.k>=16&&this.k<=20?1:0
    }

    update(){
        // init hidden mode when cat is not in tile
        this.hiddenTile()
    }

    drawHome(){
        ctx.fillStyle = `#${GameInit.theme.surfaceColor[this.k-this.type]}`
        ctx.fillRect(isoX(this.x, this.y)-60, isoY(this.x, this.y+1)-this.h*60 ,100,100)
    }

    tunnel(){
        
    }

    destory(){
        if(this.broken) return;
        this.broken = 1;
        // // 將 Tile 分成 4 個碎片
        // const fragSize = 16; // 每塊碎片大小
        // this.fragments = [];
        // for (let fx = 0; fx < 2; fx++) {
        //     for (let fy = 0; fy < 2; fy++) {
        //         this.fragments.push({
        //             x: this.x + fx*0.5,
        //             y: this.y + fy*0.5,
        //             vx: (Math.random()-0.5)*5,
        //             vy: -Math.random()*5,
        //             size: fragSize,
        //             h: this.h
        //         });
        //     }
        // }
        GameInit.tileTable[`${this.x},${this.y}`] = null
        GameInit.item.splice(GameInit.item.indexOf(this), 1);
    }
    draw() {

        const h = this.h * 25

        if(this.k>=1 && this.k<=5 && !this.b){
            //this.drawHome()
        }
        if(this.b==1){
            ctx.save()
            ctx.beginPath();
            ctx.fillStyle="#FFF"
            ctx.globalAlpha= 0.3
            ctx.moveTo(isoX(this.x, this.y), isoY(this.x, this.y) - h-25);
            ctx.lineTo(isoX(this.x + 1, this.y), isoY(this.x + 1, this.y) - h-25);
            ctx.lineTo(isoX(this.x + 1, this.y + 1), isoY(this.x + 1, this.y + 1) - h-25);
            ctx.lineTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1) - h-25);
            ctx.closePath();
            // console.log(GameInit.theme.surfaceColor[this.k])
            ctx.fillStyle = `#${GameInit.theme.surfaceColor[this.k-this.type]}`;
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1) -h-25);
            ctx.lineTo(isoX(this.x + 1, this.y+2), isoY(this.x + 1, this.y+2)-h-25);
            ctx.lineTo(isoX(this.x + 2, this.y+2), isoY(this.x + 2, this.y+2)-h-25);
            ctx.lineTo(isoX(this.x + 1, this.y+1), isoY(this.x + 1, this.y+1)-h-25);
            ctx.fillStyle = "#014";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(isoX(this.x + 1, this.y+1), isoY(this.x + 1, this.y+1)-h-25);
            ctx.lineTo(isoX(this.x + 2, this.y+2), isoY(this.x + 2, this.y+2)-h-25);
            ctx.lineTo(isoX(this.x + 2, this.y+1), isoY(this.x + 2, this.y+1)-h-25);
            ctx.lineTo(isoX(this.x + 1 , this.y), isoY(this.x + 1, this.y)-h-25);
            ctx.closePath();
            ctx.fillStyle = "#014"
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore()
            return;
        }
        ctx.beginPath();
        ctx.fillStyle="#FFF"
        ctx.moveTo(isoX(this.x, this.y), isoY(this.x, this.y) - h);
        ctx.lineTo(isoX(this.x + 1, this.y), isoY(this.x + 1, this.y) - h);
        ctx.lineTo(isoX(this.x + 1, this.y + 1), isoY(this.x + 1, this.y + 1) - h);
        ctx.lineTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1) - h);
        ctx.closePath();
        // console.log(GameInit.theme.surfaceColor[this.k])
        ctx.fillStyle = `#${GameInit.theme.surfaceColor[this.k-this.type]}`;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
            
        ctx.beginPath();
        ctx.moveTo(isoX(this.x, this.y + 1), isoY(this.x, this.y + 1)-h);
        ctx.lineTo(isoX(this.x + 1, this.y+2), isoY(this.x + 1, this.y+2));
        ctx.lineTo(isoX(this.x + 2, this.y+2), isoY(this.x + 2, this.y+2));
        ctx.lineTo(isoX(this.x + 1, this.y+1), isoY(this.x + 1, this.y+1)-h);
        ctx.closePath();
        ctx.fillStyle = "#a14"
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
            
        ctx.beginPath();
        ctx.moveTo(isoX(this.x + 1, this.y+1), isoY(this.x + 1, this.y+1)-h);
        ctx.lineTo(isoX(this.x + 2, this.y+2), isoY(this.x + 2, this.y+2));
        ctx.lineTo(isoX(this.x + 2, this.y+1), isoY(this.x + 2, this.y+1));
        ctx.lineTo(isoX(this.x + 1 , this.y), isoY(this.x + 1, this.y)-h);
        ctx.closePath();
        ctx.fillStyle = "#a14"
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
            
        if(!this.hidden){
            ctx.font = "bold 20px sans-serif";
            ctx.fillStyle = "#000";
            ctx.fillText(this.n, isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) - h + 10);
        }else{
            ctx.fillText("?", isoX(this.x + 0.5, this.y + 0.5), isoY(this.x + 0.5, this.y + 0.5) - h + 10);
        }
    }
}

export {Tile}