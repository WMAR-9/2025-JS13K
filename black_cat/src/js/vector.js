import { add, dot, resetXY, substract } from "./basic"

class Vector{
    constructor(pos,wh=resetXY(0,0)){
      this.pos = pos
      this.wh = wh
    }
    add(v){
      this.pos = add(this.pos,v)
      return this
    }
    substract(v){
      this.pos = substract(this.pos,v)
      return this;
    }
    dot(a){
      this.pos = dot(a)
      return this
    }
    clone(){
      return new Vector(this.pos,this.wh)
    }
    // equal(v){
    //   return this.x==v.x&&this.y==v.y
    // }
    // inside(v){
    //   return this.x<v.x&&this.y<v.y&&this.x>=0 && this.y>=0
    // }
    // zero(){
    //   this.x=this.y=0;
    // }
    // dotwh(){
    //   this.x*=this.w
    //   this.y*=this.h
    //   return this
    // }

}

export { Vector }