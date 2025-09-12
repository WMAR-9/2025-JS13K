import { PI } from "./basic";

const doc = document
// canvas Handle
const createC = _ =>doc.createElement('canvas')
const getC = a => a.getContext('2d');
const setWH = (c,w=32,h=32)=>{
    c.width= w;
    c.height= h;
    return c
}

// Image
const createImg = _ =>new Image()
const toPng = a =>a.toDataURL()

const canvas = doc.getElementById('a');
const ctx = getC(canvas);

const dIso = (img, x, size, cx,cy,sy=.5,st = 0, time = 0, spin = 0) => {
    ctx.save();
    const offsetY = spin ? Math.sin(time) * 10 : 0;
    ctx.translate(cx + x, cy + offsetY);

    if (spin) {
        const scaleX = st || Math.cos(time);
        ctx.scale(scaleX, 0.5);
        const shadowScale = 0.6 + Math.sin(time) * 0.4;
        ctx.fillStyle = "#666";
        ctx.beginPath();
        ctx.ellipse(0, size * 0.4, size * 0.2 * shadowScale, size * 0.15 * shadowScale, 0, 0, PI * 2);
        ctx.fill();
    } else {
        ctx.scale(1, sy);
        ctx.rotate(PI / 4);
    }

    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
}

export { canvas, ctx ,createImg,toPng,createC,getC,setWH,dIso}