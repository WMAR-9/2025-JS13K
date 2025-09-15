import { Cat } from "../Cat"
import { GameInit } from "../init"
import { Item } from "../object";
import { Timer } from "../timer";
import { TransitionEffect } from "../trans/transform";
import { Vector } from "../vector";
import { Tile } from "./tileitem"

const classRegistry = {
  "Item": Item,
  "Cat": Cat,
  "Tile": Tile,
  "Vector": Vector
};

function revive(data) {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(revive);
  if (data.__class && classRegistry[data.__class]) {
    return classRegistry[data.__class].fromData(data);
  }
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, revive(v)]));
}

class GameMap {
  constructor() {
    // moving history
    this.index = -1;
  }
  
  changelevel(level){
    GameInit.restartLevel = 0
    
    GameInit.level = level

    if(GameInit.level>GameInit.maxLevel){
      GameInit.level = 0
      GameInit.state = 0
      return;
    }
    
    this.initMap()
    this.genMap()
    GameInit.levelcleared = 0

  }
  genMap(){    
    let currentMap = GameInit.mapLevel[GameInit.level]

    for (let obj in currentMap) {
      if (obj==0) {
        let num = currentMap[3]
        GameInit.item = currentMap[obj].flatMap(
          (tiles, groupIndex) => tiles.map(
            ([k, h,n], idx) =>{
              // clone address
              let v = n?n:num?num:0;
              GameInit.tileTable[`${idx},${groupIndex}`]=new Tile(idx,groupIndex,h,k,v)
              return GameInit.tileTable[`${idx},${groupIndex}`]
            }
          )
        )
        console.log("obj 1",GameInit.item)
      }
      if (obj==1) {
        currentMap[obj].map(
          item => {
            GameInit.tileTable[`${item[0]},${item[1]},${item[2]},${item[3]}`]=new Tile(item[0],item[1],item[2],item[3],0,1)
            GameInit.item.push(GameInit.tileTable[`${item[0]},${item[1]},${item[2]},${item[3]}`])
          }
        )
        console.log("obj 2",GameInit.item)
      }
      if (obj==2) {
        GameInit.cats = currentMap[obj].map(
          cats => new Cat(cats[0],cats[1],cats[2],cats[3])
        )
        console.log(GameInit.cats)
      }
    }

    // start animation 
    GameInit.transOn = new TransitionEffect(0)
  }

  initMap(){
    GameInit.item=[]
    GameInit.cats=[]
    GameInit.tileTable={}
    GameInit.prevMap=[]
  }

  save(){
   GameInit.prevMap.push({
    items: GameInit.item.map(i => i.toData()),
    cats: GameInit.cats.map(c => c.toData())
    })
  }

  undo(){

    if (GameInit.prevMap.length > 0) {
      return this.restoreSnapshot();
    }
    return null;
  }

  restoreSnapshot() {
    const last = GameInit.prevMap.pop();
    if (!last) return null;
    
    GameInit.cats = last.cats.map(revive);
    GameInit.tileTable = {}
    GameInit.item = last.items.map(item => {
      let revived = revive(item);
      let key;
      if (revived.b == 0) {
        key = `${revived.x},${revived.y}`;
      } else {
        key = `${revived.x},${revived.y},${revived.h},${revived.k}`;
      }
      GameInit.tileTable[key] = revived;
      return revived;
    });
  }
}

export {GameMap,classRegistry,revive}