import { createCanvas, loadImage } from "canvas"
import fs from "fs";

class genCode{
    array2String(arr, color_bit = 4) {
        let result = "", temp = 0, count = 0;
        const max_bits = 18; 
        const bit_size = max_bits / color_bit; 
    
        arr.forEach((e, i) => {

            temp += (e << (color_bit * count));
            count++;
    
            if (count >= bit_size) {
                result += String.fromCodePoint(temp);
                temp = 0;
                count = 0;
            }
        });

        if (count > 0) {
            result += String.fromCodePoint(temp);
        }
    
        return result;
    }
    array2Zero(arr,length){
        let result = "["
        arr.forEach((e,i)=>{
            //result+=e?i!=arr.length-1?`${e},`:"":i!=arr.length-1?",":""
            let temp =""
            if(e!=length){
                if(i!==arr.length-1){
                    temp=`${e},`
                }else{
                    temp=`${e}`
                }
            }else{
                if(i!==arr.length-1){
                    temp=`,`
                }
            }
            result += temp
        })
        result+="]"
        return result
    }
    array2ZipString(arr){
        let tempChar = arr.concat().shift(),count=0
        let result="",i
        for(i=1;i<arr.length;i++){
            if(tempChar===arr[i]){
                count += 1
            }else{
                result +=(count||"")+String.fromCodePoint(+tempChar)
                count = 0
                tempChar = arr[i]
            }
        }
        result += (count||"")+String.fromCodePoint(+tempChar)
        return result
    }
}

class deCode{
    string2Array(str, color_bit = 4, originalLength = 48*16) {
        let result = [];
        const color_space = (1 << color_bit) - 1;
        const max_bits = 18;
        const bit_size = max_bits / color_bit;
    
        [...str].forEach((char) => {
            let temp = char.codePointAt(0);
    
            for (let i = 0; i < bit_size; i++) {
                result.push(temp & color_space);
                temp >>= color_bit;
            }
        });

        if (result.length > originalLength) {
            result = result.slice(0, originalLength);
        }
    
        return result;
    }
    zipString2Array(str){
        let temp = str.split(/(\D)/).map((v,i,e)=>+v?e[i+1].repeat(v):v).join("");
        return [...temp].map(e=>e.codePointAt(0))
    }
    zeroArray2Code(str){
        return str.replace(/\[|\]|/g,"").split(',')
    }
}

const arr2D21D = (t,w,h)=>{
    const blocks = [];

    for (let row = 0; row < t.length; row += h) {
        for (let col = 0; col < t[0].length; col += w) {
            const block = [];
            for (let i = row; i < row + h; i++) {
                block.push(...t[i].slice(col, col + w));
            }
            blocks.push(block);
        }
    }

    console.log("block > ",blocks);
    return blocks
}


// Find the closest color
function findClosestPalette(rgb, palette) {
    let minDist = Infinity;
    let bestIndex = 0;
    for (let i = 0; i < palette.length; i++) {
        const [pr, pg, pb] = palette[i];
        const dist = (rgb[0] - pr) ** 2 + (rgb[1] - pg) ** 2 + (rgb[2] - pb) ** 2;
        if (dist < minDist) {
            minDist = dist;
            bestIndex = i;
        }
    }
    return bestIndex;
}

// Image to 2D array

async function imageToPaletteIndex(path, palette, transparentIndex = 0, alphaThreshold = 0) {
    const img = await loadImage(path);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    const arr2D = [];
    for (let y = 0; y < img.height; y++) {
        const row = [];
        for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            if (a == 0) {
                row.push(transparentIndex);
            } else {
                row.push(findClosestPalette([r,g,b], palette));
            }
        }
        arr2D.push(row);
    }
    return arr2D;
}

const colorPalette = [
  [800,800,800],
  [0, 0, 0],
  [255, 255, 255]
  // ...
];

(async () => {
  const gen = new genCode();
  const de = new deCode();
  const blocksize = 11;
  const blocksizeY = 16;
  const array2D = await imageToPaletteIndex("./block.png", colorPalette);
  console.log("2D Array:", array2D);

  // turn block (16x16 blocks)
  const blocks = arr2D21D(array2D, blocksize, blocksizeY);

  // zero zip block
//   const row = [];
//   blocks.forEach(block => {
//     row.push(gen.array2Zero(block, colorPalette.length));
//   });

  // string zip block
  const row = [];
  blocks.forEach(block => {
    row.push(gen.array2ZipString(block));
  });

  console.log("After zip string:", row);
  const zipBase64 = row.map(s => btoa(unescape(encodeURIComponent(s))));

  console.log("copy Base64:", zipBase64.join("\n"));
  
    // zero unzip 
  //const decompressedBlocks = row.map(str => de.zeroArray2Code(str));
  //console.log("unzip array:", decompressedBlocks);

  // string unzip 
  const decodedZip = zipBase64.map(s => decodeURIComponent(escape(atob(s))));
  const decompressedBlocks = decodedZip.map(str => de.zipString2Array(str));
  console.log("unzip array:", decompressedBlocks);

    // reset image to show decode is work
    const canvasWidth = 1 * blocksize;
    const canvasHeight = Math.ceil(decompressedBlocks.length / 1) * blocksizeY;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");

    decompressedBlocks.forEach((block, bIdx) => {
        const blockX = (bIdx % 1) * blocksize;
        const blockY = Math.floor(bIdx / 1) * blocksizeY;

        for(let y=0; y<blocksizeY; y++){
            for(let x=0; x<blocksize; x++){
                const idx = y * blocksize + x;
                const colorIdx = block[idx] ?? colorPalette.length;
                if(colorIdx >= colorPalette.length) continue;
                const [r,g,b] = colorPalette[colorIdx];

                ctx.fillStyle = `rgba(${r},${g},${b},${colorIdx==0?0:1})`;
                ctx.fillRect(blockX + x, blockY + y, 1, 1);
            }
        }
    });
    const out = fs.createWriteStream("./output.png");
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log("Png is done: output.png"));

})();