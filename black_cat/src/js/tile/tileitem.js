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
    // zero tile 
    resetzero(){
        if(this.zeroBtn)return;
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

    drawHome(){
        ctx.fillStyle = `#${GameInit.theme.surfaceColor[this.k-this.ty]}`
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
        let xx = this.x,yy=this.y
        const h = this.h *30
        
        if(this.b){
            this.poly(this.x,this.y,h)
            return ;
        }
        
        // setting block half
        for(var i = this.h-1;i>=0;i--){
            this.poly(this.x,this.y,h-i*45)
            ctx.drawImage(GameInit.ig[0][0], isoX(this.x-1,this.y),isoY(this.x,this.y)-h+i*45, GameInit.tileW, GameInit.tileW-60);
        }

        let cx = isoX(xx + 0.5, yy + 0.5);
        let cy = isoY(xx + 0.5, yy + 0.5) - h;
        
        let baseSize = GameInit.tileW / 2;

        if(this.k>=1 && this.k<=5 && !this.b){
           this.dt.start()
           dIso(GameInit.ig[0][2],0,baseSize,cx,cy,1,this.dt.progress*3.5,1);
        }

        if (this.k >= 6 && this.k <= 10){
            dIso(GameInit.f[0][2], 0, baseSize,cx,cy);
        }

        if (this.k >= 11 && this.k <= 15){
            dIso(GameInit.f['x'][2], 0, baseSize,cx,cy);
        }

        if (this.k == 0 || (this.k >= 16 && this.k <= 20)) {

            if (this.hidden) {
                dIso(GameInit.f['?'][2], 0, baseSize,cx,cy);
                return;
            }

            const digits = String(this.n).split('').map(Number);
            const size = baseSize / digits.length;

            digits.forEach((d, i) => {
                const offsetX = (i - (digits.length - 1) / 2) * size;
                dIso(GameInit.f[d][3], offsetX, size,cx,cy);
            });

        }

        if (this.k >= 21 && this.k <= 25){
            this.dt.start()
            dIso(GameInit.ig[5][2],0,baseSize,cx,cy,0,this.dt.progress*3.5,1);
        }

    }
    poly(xx,yy,h) {

        const faces = [
                [
                    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]
                ],
                [
                    [0, 1, 0], [1, 2, 0, 50], [2, 2, 0, 50], [1, 1, 0]
                ],
                [
                    [1, 1, 0], [2, 2, 0, 50], [2, 1, 0, 50], [1, 0, 0]
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
            ctx.fillStyle = shadeColor(`${GameInit.theme.surfaceColor[this.k - this.ty]}`,i*20);
            ctx.fill();
            ctx.strokeStyle = shadeColor(`666666`,i*30);
            ctx.lineWidth = 2;
            ctx.stroke();
        })
        
    }
}

export {Tile}