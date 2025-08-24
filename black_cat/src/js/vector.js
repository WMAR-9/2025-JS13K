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
    
    toData() {
      return {
        __class: "Vector",
        x: this.x,
        y: this.y,
        wh: this.wh 
      }
    }
    static fromData(data) {
      return new Vector(data.x, data.y, data.wh)
    }

}

export { Vector }