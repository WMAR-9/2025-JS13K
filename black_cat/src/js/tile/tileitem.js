import { play } from "../audio/audio1";
import { floor, isoX, isoY, resetXY, shadeColor } from "../basic";
import { ctx, dIso } from "../canvas";
import { GameInit } from "../init";
import { Item } from "../object";

class Tile extends Item {
    constructor(x, y, h, k, num=0,block=0) {
        super(x, y, 32, 32, h, k,num,block);
        
        // num have two use 1.count 2. ty of cat 
        this.hiddenTile()
        // zero only once 
        this.zeroBtn = 0
        
        // ty divide
        if(k!=0&&block==0)this.ty = floor((k - 1) / 5) * 5
        else this.ty = 0

        //cross 
        this.fragments = null;
        this.broken = 0;

        // block box
    }
    toData() {
        return {
        ...super.toData(),
        __class: "Tile",
        zeroBtn: this.zeroBtn,
        ty: this.ty,
        hidden: this.hidden
        };
    }

    static fromData(data) {
        let tile = new Tile(data.x, data.y, data.h, data.k, data.n, data.b);
        tile.zeroBtn = data.zeroBtn
        tile.hidden = data.hidden
        tile.ty = data.ty
        return tile;
    }
    islose(){
        return this.n>13
    }
    // zero tile 
    resetzero(){
        if(this.zeroBtn||this.islose())return;
        if(this.k>=6&&this.k<=10)this.zeroBtn=1;
        this.n = 0
    }
    
    // default plus 1
    plusmove(){
        if(this.k==0 || (this.k>=16&&this.k<=20))this.n++;
    }

    // hidden tile
    openTile(){
        this.hidden = 0
    }
    hiddenTile(){
        this.hidden = this.k>=16&&this.k<=20?1:0
    }

    update(){
        // init hidden mode when cat is not in tile
        this.hiddenTile()
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
        ctx.save()
        ctx.globalAlpha=this.a
        let xx = this.x,yy=this.y,size = GameInit.tileW
        const h = this.h * size/5

        let cx = isoX(xx + 0.5, yy + 0.5);
        let cy = isoY(xx + 0.5, yy + 0.5) - h;
        let baseSize = size / 2;

        if(this.b){
            ctx.save()
            ctx.globalAlpha=.6
            ctx.globalCompositeOperation = "source-atop"
            dIso(GameInit.ig[6][this.k],0,size/1.3,cx,cy+size/6,.5,1,0,1);
            ctx.restore()
            return ;
        }
        
        // setting block half
        for(var i = this.h-1;i>=0;i--){
            this.poly(this.x,this.y,h-i*size/4)
            //ctx.drawImage(GameInit.ig[0][3], isoX(this.x-1,this.y),isoY(this.x,this.y)-h+i*size/4, size, size/1.4);
        }

        if(this.k>=1 && this.k<=5 && !this.b){
           this.dt.start()
           dIso(GameInit.ig[1][this.k%5],0,size/1.5,cx,cy-baseSize/5,1,1,this.dt.progress*3.5,1);
        }

        if (this.k >= 6 && this.k <= 10 && !this.zeroBtn){
           this.dt.start()
           dIso(GameInit.ig[2][this.k%5],0,baseSize/1.5,cx,cy-baseSize/5,1,1,this.dt.progress*3.5,1);
        }

        if (this.k >= 11 && this.k <= 15){
            dIso(GameInit.f['x'][this.k%5], 0, baseSize,cx,cy);
        }

        if (this.k == 0 || (this.k >= 16 && this.k <= 20)) {

            if (this.hidden) {
                dIso(GameInit.f['?'][this.k%5], 0, baseSize,cx,cy);
                return;
            }

            const digits = String(this.n).split('').map(Number);
            const size1 = baseSize / digits.length;

            digits.forEach((d, i) => {
                const offsetX = (i - (digits.length - 1) / 2) * size1;
                dIso(GameInit.f[d][this.k%5], offsetX, size1,cx,cy);
            });

        }

        if (this.k >= 21 && this.k <= 25){
            this.dt.start()
            dIso(GameInit.ig[5][this.k%5],0,baseSize,cx,cy,1,0,this.dt.progress*3.5,1);
        }
        ctx.restore()
    }
    poly(xx,yy,h) {
        const size = GameInit.tileW/3.75
        const faces = [
                [
                    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]
                ],
                [
                    [0, 1, 0], [1, 2, 0, size], [2, 2, 0, size], [1, 1, 0]
                ],
                [
                    [1, 1, 0], [2, 2, 0, size], [2, 1, 0, size], [1, 0, 0]
                ]
        ];

        faces.forEach((a,i) => {
            ctx.beginPath();
            a.map(([dx, dy, dh = 0, dz = 0],i) =>{
                const { x, y } = resetXY(isoX(xx+dx, yy+dy), isoY(xx+dx, yy+dy) - (h+dh) - dz);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }),
            ctx.closePath();
            ctx.fillStyle = shadeColor(`${GameInit.theme.surC[this.k%5]}`,i*20);
            ctx.fill();
            ctx.strokeStyle = shadeColor(`666666`,i*30);
            ctx.lineWidth = 2;
            ctx.stroke();
        })
    }
}

export {Tile}