import { add, dot, isoX, isoY, resetXY } from "./basic"

class Vector{
    constructor(x,y,wh=resetXY(0,0)){
      this.x = x
      this.y = y
      this.wh = wh
    }
    add(v){
      this.x += v.x
      this.y += v.y
      return this
    }
    substract(v){
      this.x -= v.x
      this.y -= v.y
      return this;
    }
    substractY(y){
      this.y -= y
      return this
    }
    substractX(x){
      this.x -= x
      return this
    }
    dot(a){
      this.x *= a
      this.y *= a
      return this;
    }
    devide(a){
      this.x /= a
      this.y /= a
      return this;
    }
    clone(){
      return new Vector(this.x,this.y,this.wh)
    }
    setX(x){
      this.x = x
      return this
    }
    setY(y){
      this.y = y
      return this
    }
    tranisoXY(){
      const x = isoX(this.x,this.y)
      this.y = isoY(this.x,this.y)
      this.x = x
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