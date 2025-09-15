import { min } from "./basic";

class Timer {
    constructor(step = 1,l=0) {
        this.set(0,1,step)
        this.l = l
        this.e=0
    }

    set(s, et, step) {
        this.s = s;
        this.et = et;
        this.step = step;
    }
    
    curTime(){
      return performance.now()
    }

    add() {
        this.s += this.step;
    }
    
    sub() {
        this.s -= this.step;
    }

    clone(){
      return new Timer(this.step,this.l)
    }
    
    reset() {
        this.s = 0;
        this.e=0
    }

    start() {
        if (this.s < this.et) {
            this.add()
        } else {
            this.e=1
            if(this.l){
                this.reset()
            }
        }
    }
    // animate
    get progress() {
        return min(this.s / this.et, 1);
    }
}

export { Timer }