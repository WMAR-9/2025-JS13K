import { GameInit } from "./init";

// For zip
const m = Math
const PI = m.PI

const max =(a,b)=>a>b?a:b;
const min =(a,b)=>(a<b)?a:b;
const rand=a=>m.random()*a
const randInt=a=>rand(a)|0;
const resetXY = (x,y)=>({x,y})

const isoX=(x,y)=>(x-y)*GameInit.tileW/2
const isoY=(x,y)=>(x+y)*GameInit.tileW/4

const floor = a =>m.floor(a)
const floorSet = a =>resetXY(floor(a.x),floor(a.y))
const abs = a =>m.abs(a)
const sign = a=>m.sign(a)
const sin = a=>m.sin(a)
const cos = a=>m.cos(a)
const hypot = (a,b)=>m.hypot(a.x - b.x, a.y - b.y)

const add = (a,b) =>resetXY(a.x+b.x,a.y+b.y)
const dot=(a,b)=>resetXY(a.x*b,a.y*b)
const substract=(a,b)=>resetXY(a.x-b.x,a.y-b.y)
const comp=(a,b)=>a.x==b.x&&a.y==b.y

// color
const shadeColor=(color, percent)=>{
    var num = parseInt(color, 16),
      amt = m.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

const l = localStorage
// Set local memory 
const localSet=(e,a)=>l.setItem(e,JSON.stringify(a))
const localGet=e=>l.getItem(e)

export {
  PI,
  localSet,
  localGet,
  floor,
  floorSet,
  rand,
  randInt,
  max,
  min,
  abs,
  sign,
  add,
  substract,
  dot,
  comp,
  resetXY,
  isoX,
  isoY,
  shadeColor,sin,cos,hypot
}