import { floor } from "../basic";
import { createC, createImg, getC, setWH, toPng } from "../canvas";
import { GameInit } from "../init";

const createAsset = (img,sx,sy,n,m,color=[],c=0,tx = 50, ty = 50) => {
    
    const offC = setWH(createC(),n,m);

    getC(offC).drawImage(img, sx, sy, n, m,0,0,n,m);

    const data = getC(offC).getImageData(0, 0, n, m).data;

    const drawC = setWH(createC(),n*tx,m*ty);
    
    const dCtx = getC(drawC);

    for (let y = 0; y < m; y++) {
        for (let x = 0; x < n; x++) {
            const i = (y * n + x) * 4;
            dCtx.save()

            // setting color
            if(c) dCtx.fillStyle = "#"+color[0];
            else dCtx.fillStyle = "#"+color[data[i]%255];
            
            dCtx.globalAlpha=data[i+3] / 255
            dCtx.fillRect(x * tx, y * ty, tx, ty);
            dCtx.restore()
        }
    }

    const newImg = createImg();
    newImg.src = toPng(drawC);
    return newImg
};

const allPng=img=>{
    // create A-Z IMG
    // createAsset(img,0,5,5,5,["aa0"])
    const c = [["000"],["fff"],["a18","adf","151"],["0a8"],["25a"]]
    const a = "0123456789abcdefghijklmnopqrstuvwxyz?"
    const _build=(start,end,step,y,dx,dy,oc,color=c,hashset=[])=>{
        for(var i=start;i<end;i+=step){
            const k = []
            for(var t=0;t<5;t++){
                k.push(createAsset(img,i,y,dx,dy,color[t],oc))
            }
            if(hashset instanceof Array){
                hashset.push(k)
            }else{
                hashset[a[(i/5)|0]] = k
            } 
        }
        return hashset
    }
    
    GameInit.f = _build(0,185,5,0,5,5,1,c,{})
    const tiles = _build(0,22,11,5,11,16,1)
    const item = _build(22,150,16,5,16,16,0)
    // cat 1 idle 2 idle 3 jump 
    // item[0],item[1],item[2]
    GameInit.ig = [tiles[1], item[5],item[6],GameInit.f['x'],GameInit.f['?'], tiles[0],item[7]];
    GameInit.ic = [...item.slice(0, 4)];
    
    // create Item tile 0 = default, 1:[0~6]=> home,zero,cross,?,change,tunnel
    // const temp = []
    // for(var i=0;i<11*2;i+=11){
    //     const k = []
    //     for(var t=0;t<5;t++){
    //         k.push(createAsset(img,i,5,11,16,[c[t]],1))
    //     }
    //     temp.push(k)
    // }
    // const defaultTile = []
    // for(var i=22;i<22+16*8;i+=16){
    //     const k = []
    //     for(var t=0;t<5;t++){
    //         k.push(createAsset(img,i,5,16,16,[c[t]]))
    //     }
    //     defaultTile.push(k)
    // }

}

export { allPng };