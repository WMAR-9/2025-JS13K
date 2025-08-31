const GameInit ={
  // game setting 0 home,1 menu, 2 gameloop
  state:2,
  sound:0,
  
  // window size
  window_width: window.innerWidth,
  window_height: window.innerHeight,
  tileW:200,
  mapW:1,
  mapH:3,
  
  // color
  theme:{
    surfaceColor:["773000","71a797","a03","030","080","a2a","a4f","0fa","a06"]
  },
  // image 0 = tiles, 1 = [] ,2 = []
  ig:[],
  ic:[],
  f:{},

  // item
  tileTable:{},
  item:[],
  cats:[],
  // handle trans
  transOn:null,
  // handle map /level up
  restartLevel:0,
  levelcleared:0,
  level:0,
  maxLevel:1,
  mapLevel:[
    {
        0:[
          // [[0,1]]
          [[0,1],[7,1],[0,1]],
          [[2,4],[12,3],[1,2]],
          [[1,3],[11,1],[16,2],[1,2]],
          [[1,3],[0,2],[6,2],[21,2]],
          [[1,3],[0,4],[16,1],[1,1]]
        ],
        // 1:[[1,1,4,1],[1,2,3,2]],
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
  moves:{ 37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1] },
  in:0
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