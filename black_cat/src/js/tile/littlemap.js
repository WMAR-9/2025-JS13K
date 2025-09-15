import { floor, max, shadeColor } from "../basic";
import { ctx } from "../canvas";
import { GameInit } from "../init";

const minimap=(level = GameInit.level)=>{
    const map = GameInit.mapLevel[level][0];
    if (map=={}) return;

    const miniMapW = GameInit.tileW / 1.5;
    const miniMapH = GameInit.tileW / 1.5;
    const offsetX = GameInit.tileW/15, offsetY = GameInit.tileW/15;

    const rows = map.length;
    const cols = Math.max(...map.map(row => row.length));

    const cellW = max(10, floor(miniMapW / cols));
    const cellH = max(10, floor(miniMapH / rows));

    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#3a7";
    ctx.fillRect(offsetX - 5, offsetY - 5, cellW * cols + 10, cellH * rows + 10);
    ctx.restore()
    ctx.save()
    const catTable = {};
    GameInit.cats.forEach(cat => {
        const key = `${cat.x},${cat.y}`;
        if (!catTable[key]) catTable[key] = [];
        catTable[key].push(cat);
    });

    // temp color
    let color = "053"
    let f= GameInit.theme.f.flat(1)
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const [tileId, tileType] = map[y][x];
            if(tileId>0&&tileId<6){
                ctx.fillStyle = "#"+f[(tileId)%5]
            }else if(tileId>10&&tileId<16)
                ctx.fillStyle = shadeColor(f[(tileId)%5],20)
            else{
                ctx.fillStyle = "#"+color
            }
            ctx.fillRect(offsetX + x * cellW, offsetY + y * cellH, cellW - 2, cellH - 2);
            
            const catsHere = catTable[`${x},${y}`];
            if (catsHere && catsHere.length) {
                catsHere.sort((a, b) => b.h - a.h);
                catsHere.forEach((cat, idx) => {
                    ctx.fillStyle = shadeColor(f[cat.k%5],-20)
                    ctx.fillRect(
                        offsetX + x * cellW + (cellW / 5),
                        offsetY + y * cellH + idx *( cellH / 4),
                        cellW / 5,
                        cellH / 5
                    );
                });
            }
        }
    }
    const instructions = [
        "Q: Undo",
        "W: Sound:",
        "E: Home",
        "R: Restart"
    ];
    const textX = offsetX + cols * cellW + 20;
    const textY = offsetY;
    const size = GameInit.tileW/8;
    const ls = 1;
    const lh = 2;

    instructions.forEach((line, row) => {
        let col = 0;
        if (row==1)line+=GameInit.sound?"ON":"OFF";
        for (let i = 0; i < line.length; i++) {
            let ch = line[i];
            if (ch==" ") { col++; continue; }
            const g = GameInit.f[ch.toLowerCase()];
            if (g) {
                ctx.drawImage(
                    g[3],
                    textX + col * (size + ls),
                    textY + row * (size + lh+5),
                    size,
                    size
                );
            }
            col++;
        }
    });

    ctx.restore();
}

export {minimap}