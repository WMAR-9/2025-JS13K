const GameInit ={
  // window size
  window_width: window.innerWidth,
  window_height: window.innerHeight,
  tileW:160,
  mapW:1,
  mapH:3,
  
  // color
  theme:{
    surfaceColor:["730","300","80a","030","080","a2a","a4f","0fa","a06"]
  },

  // item
  tileTable:{},
  item:[],
  cats:[],
  block:[],
  
  // handle map /level up
  restartLevel:0,
  levelcleared:0,
  level:0,
  maxLevel:1,
  mapLevel:[
    {
        0:[
          [[0,2],[0,2]],
          [[1,1],[21,3]],
          [[2,3],[16,2]]
        ],
        1:[[1,1,4,1],[1,2,3,2]],
        2:[[0,0,2,2],[0,1,1,1]]
    },
    {
        0:[
          [[0,2],[0,1]],
          [[1,1],[16,3]],
          [[2,3],[16,2]]
        ],
        1:[[1,1,2,4]],
        2:[[0,0,2,2]]
    }
  ],
  prevMap:[],
  // handle input
  moves:{ 37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1] }
}
// 
/**
 * currentMap format
 * {
 *  0: [
 *        [[0,1],[0,1]],
 *        [[0,1],[0,1]]
 *        [[0,1],[0,1]]
 *     ],
 *  1: [[x,y,k,h],[x,y,k,h]]
 * 
 *  2: [[x,y,k,h],[x,y,k,h]]
 * }
 */

export {GameInit}