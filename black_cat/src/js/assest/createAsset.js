import { floor } from "../basic";
import { createC, createImg, getC, setWH, toPng } from "../canvas";
import { GameInit } from "../init";

const createAsset =async (img,sx,sy,n,m,color=[],c=0,tx = 50, ty = 50) => 
    new Promise(r=>{

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
                else dCtx.fillStyle = "#"+color[data[i]%3];
                
                dCtx.globalAlpha=data[i+3] / 255
                dCtx.fillRect(x * tx, y * ty, tx, ty);
                dCtx.restore()
            }
        }

        const newImg = createImg();
        newImg.onload=_=>r(newImg)
        newImg.src = toPng(drawC);
    })

const allPng=async img=>{
    // create A-Z IMG
    // createAsset(img,0,5,5,5,["aa0"])
    const c = GameInit.theme.cats
    const fontColor = GameInit.theme.f
    const itemColor = GameInit.theme.i
    const a = "0123456789abcdefghijklmnopqrstuvwxyz?:#"

    const _mirror =async asset =>
        new Promise(resolve => {
            const mirrorCanvas = setWH(createC(), asset.width, asset.height);
            const mCtx = getC(mirrorCanvas);
            mCtx.save();
            mCtx.translate(asset.width, 0);
            mCtx.scale(-1, 1);
            mCtx.drawImage(asset, 0, 0);
            mCtx.restore();
            const mirrorImg = createImg();
            mirrorImg.onload = () => resolve(mirrorImg);
            mirrorImg.src = toPng(mirrorCanvas);
    });

    const _build= async (start,end,step,y,dx,dy,oc,color=c,hashset=[],mirror=0)=>{
        for(var i=start;i<end;i+=step){
            const k = []
            for(var t=0;t<5;t++){
                let asset =await createAsset(img,i,y,dx,dy,color[t],oc)
                if (mirror) {
                    asset = await _mirror(asset)
                }
                k.push(asset)
            }
            if(hashset instanceof Array){
                hashset.push(k)
            }else{
                
                hashset[a[floor(i/5)]] = k
            } 
        }
        return hashset
    }
    // font color
    
    // tile color
    const [font,tiles, tile2, item, catRight, catLeft, catIdle] = await Promise.all([
    _build(0,195,5,0,5,5,1,fontColor,{}),
    _build(0,11,11,5,11,16,1,fontColor),
    _build(11,22,11,5,11,16,1),
    _build(150,198,16,5,16,16,0,itemColor),
    _build(54,150,16,5,16,16,0,c,[],0),
    _build(54,150,16,5,16,16,0,c,[],1),
    _build(22,54,16,5,16,16,0,c,[],0),
  ]);

  GameInit.f = font
  GameInit.ig = [tile2[0], item[0], item[1], GameInit.f['x'], GameInit.f['?'], tiles[0], item[2]];
  GameInit.ic = [
    [...catIdle, ...catIdle], // idle
    [...catLeft],             // left
    [...catRight],            // right
    [...catRight],            // maybe run right
    [...catLeft],             // maybe run left
  ];

  console.log("All assets ready:", GameInit.ic);
  console.log("All assets ready: ig", GameInit.ig);
  console.log("All assets ready: if", GameInit.f);
}

export { allPng };