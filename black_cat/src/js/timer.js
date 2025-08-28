import { min } from "./basic";

class Timer {
    constructor(step = 1,loop=0) {
        this.set(0,1,step)
        this.loop = loop
        this.e=0
    }

    set(startTime, endTime, step) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.step = step;
    }
    
    curTime(){
      return performance.now()
    }

    add() {
        this.startTime += this.step;
    }
    
    sub() {
        this.startTime -= this.step;
    }

    clone(){
      return new Timer(this.step,this.loop)
    }
    
    reset() {
        this.startTime = 0;
        this.e=0
    }

    start() {
        if (this.startTime < this.endTime) {
            this.add()
        } else {
            this.e=1
            if(this.loop){
                this.reset()
            }
        }
    }
    // animate
    get progress() {
        return min(this.startTime / this.endTime, 1);
    }
}

export { Timer }