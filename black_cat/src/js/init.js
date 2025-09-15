let customTile = [[0,1],[0,2],[0,3]]
const GameInit ={
  // game setting 0 home,1 menu, 2 gameloop
  state:0,
  sound:0,
  title:"#go home#",
  // window size
  wwid: 0,
  whei: 0,
  tileW:300,//150 ~ 300
  
  // color
  theme:{
    surC:["5E6287","8E5F29","5E6287","8E5F29","5E6287"],
    f:[["eacdc5"],["010101"],["f4be82"],["f3eae0"],["a3a6bf"]],
    cats:[
      ["010101","696969","ffee00"],
      ["f4be82","a1550a","50b100"],
      ["f3eae0","9b9085","003ca5"],
      ["a3a6bf","60566d","ffffff"],
      ["eacdc5","c7705a","633500"]
    ],
    i:[
      ["410100","c3625e","ff4840"],
      ["010101","c9ebdb","a2beb1"],
      ["412200","c3955e","ffa840"],
      ["8f8d91","a4a2a7","cecad4"],
      ["003541","007b96","40dcff"]
    ]
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
  transOn:0,
  ti:0,
  // story
  msg:[
    "a careful first step\na familiar sound ahead\n is mommy meow###",
    "brave even in darkness\neach fall\n rise again\n:want to go home",
    "their voice calls you\nrun faster now\nTheir hand reaches out\nThey hold you tight##\nmeow",
    "the scent leads you on\ncrossed the cold puddle\nwent around the wall\ncloser to warmth home",
    "\nthank you for playing this game\n meow# meow# meow#",
    "\n\nhome\n at last::\nbut \nmore cats \nawait black cat help##"
  ],
  ltip:[":push right key",
    "#color#",
    "there is a cat food here\ncan reset to zero",
    "avoid tree holes of\n #same color#",
    "hidden num is important",
    "cats can be #stacked#",
    "hit the wall may be an opportunity",
    "make good use of tree holes \n height differences",
    "cat food is a sign to go home\nblack x block the way", //9
    "llurulurru\nnow u need think by urself", //10
    "haha this level\ni have try 10 time\nu should find by urself",//11
    "black change is behind tile\nchange twice\nsend black cat to home",
    ":watch the hidden num 5\nlddul##\ni talk too much",//13
    "##no hint for you##\n think twice", //14
    "magic change\nmeow# meow# meow#",//15
    "here have some bug\n wish u can find it",//16
    "hihi### play with arrow key\nwelcome to the world of cats#\nthe clever black cat \nneeds to help the other cats\nreturn to their home\nyou must use your wisdom \nto lead all the cats back home\ncats only react to\n same color item\npay attention\nto the number of steps\nless than 13",
    "falling is cute\nrising is cooler##\n\nhere tips:\n"],
  cmsg:["MEOW","i am home","OOPS TOO HIGH","NO WAY","OTHER CATS","magic change","MEWWWOWW","yummy yummy","Mmm too dark","left "],
  // handle map /level up
  restartLevel:1,
  levelcleared:0,
  level:0,
  maxLevel:15,
  mapLevel:[
     { // 1 
        0:[
          [[0,1],[16,2],[1,1]],
          [[16,1],[0,1],[0,1]]
        ],
        2:[[0,0,1,1]],
        3:10
    },
    { // 2
        0:[
          [[26,1],[12,2],[1,2]],
          [[0,1],[11,1],[0,1]]
        ],
        2:[[0,1,1,1]],
        3:10
    },
    { // 3
        0:[
          [[0,3],[0,3],[1,2]],
          [[16,2],[16,1],[11,2]],
          [[6,2],[11,1],[11,1]]
        ],
        2:[[1,1,1,1]],
        3:11
    },
    { // 4
        0:[
          [[12,3],[1,3],[0,1]],
          [[0,2],[0,2],[0,2]],
          [[0,1],[0,2],[0,1]]
        ],
        1:[[1,1,3,1],[2,0,2,1]],
        2:[[2,2,1,1]],
        3:8
    },
    { // 5
        0:[
          [[0,1],[6,3],[0,2],[0,1]],
          [[0,2],[0,3],[0,2],[0,1]],
          [[0,3],[16,3,8],[0,1]],
          [[1,4],[16,1,8],[0,1],[0,2]]
        ],
        1:[[1,1,4,1]],
        2:[[1,3,1,1]]
    },
    { // 6 2 cats start
        0:[
          [[2,2],[1,2]],
          [[0,3],[0,1]],
          [[21,2],[0,1]],
          [[0,1],[0,1]]
        ],
        2:[[0,3,1,2],[1,3,1,1]],
        3:3
    },
    { // 7 2 cats start
        0:[
          [[22,3],[2,3],[1,5]],
          [[0,1],[12,3],[0,1]],
          [[0,2],[12,3],[0,2]]
        ],
        2:[[0,2,2,1],[2,2,2,2]]
    },
    { // 8 2 cats start
        0:[
          [[6,1],[0,3],[0,1]],
          [[0,2],[0,2],[22,1]],
          [[2,1],[12,2],[0,2]],
          [[1,3],[0,1],[0,1]]
        ],
        1:[[1,1,3,1],[2,2,3,1]],
        2:[[2,0,1,1],[1,3,1,2]],
        3:3
    },
    { // 9 2 cats start
        0:[
          [[0,3],[0,2],[8,4],[0,4]],
          [[1,4],[0,1],[0,3],[11,3]],
          [[0,1],[13,3],[0,2],[0,1]],
          [[0,2],[16,3,2],[3,1],[0,3]],
        ],
        2:[[0,3,2,1],[3,3,3,3]]
    },
    { // 10 3 cats start
        0:[
          [[1,5],[0,3],[3,2],[0,3]],
          [[2,3],[0,1],[0,2],[23,2]],
          [[0,3],[11,2],[0,2],[8,1]],
          [[0,2],[0,4],[0,2],[0,2]],
          [[0,1],[0,1],[0,2],[0,3]]
        ],
        1:[[2,2,3,1],[3,0,4,3]],
        2:[[3,4,3,1],[3,4,4,2],[3,4,5,3]],
    },
    { // 11 3 cats start
        0:[
          [[0,1],[15,4],[11,1],[1,5],[5,4]],
          [[0,1],[15,3],[11,1],[4,3],[0,3]],
          [[0,2],[14,2],[11,1],[0,2],[0,2]],
          [[0,3],[15,1],[11,1],[11,1]]
        ],
        2:[[0,0,1,1],[0,1,1,5],[0,3,3,4]],
        3:1
    },
    { // 12 3 cats start
        0:[
          [[10,5],[0,1],[0,3],[21,1],[5,4]],
          [[0,4],[0,1],[0,1],[0,1],[0,3]],
          [[0,3],[0,1],[0,1],[0,1],[1,1]],
          [[0,2],[0,1],[0,1],[0,1],[2,1]]
        ],
        1:[[2,0,4,1],[2,1,2,1],[2,2,2,1],[2,3,2,1],
          [3,2,2,2],[3,3,2,2]
        ],
        2:[[0,3,2,1],[1,3,1,2],[4,3,1,5]]
    },
    { // 13 4 cats start
        0:[
          [[0,3],[3,4],[1,3],[2,1],[6,4]],
          [[0,1],[9,1],[4,1],[0,1],[0,2]],
          [[0,2],[19,1,5],[0,2],[0,1],[13,1]],
          [[0,2],[12,1],[11,1],[0,2],[16,1,5]],
        ],
        2:[[1,3,1,4],[0,3,2,2],[3,0,1,3],[4,3,1,1]]
    },
    { // 14 4 cats start
        0:[
          [[21,1],[16,1],[18,2],[1,3],[2,3]],
          [[12,3],[17,1],[18,1],[17,1],[17,1]],
          [[11,2],[11,3],[11,3],[11,1],[11,3]],
          [[19,1],[3,1],[16,3],[16,1],[4,1]],
          [[19,1],[16,2],[16,1],[24,1],[16,1]],
          [[23,1],[19,1],[14,3],[16,2],[9,1]]
        ],
        2:[[1,5,1,4],[0,2,2,2],[3,0,3,3],[4,3,1,1]],
        3:2
    },
    { // 15 5 cats start
        0:[
          [[25,5],[5,5],[1,5],[3,5],[4,5]],
          [[0,4],[0,4],[0,4],[23,4],[2,4]],
          [[0,3],[0,2],[0,3],[0,3],[22,3]],
          [[0,2],[0,2],[21,2],[0,2],[0,2]],
          [[0,1],[0,1],[0,1],[0,1],[0,1]]
        ],
        2:[[0,4,1,4],[1,4,1,3],[2,4,1,2],[3,4,1,1],[4,4,1,5]],
        3:2
    },
    { // 16 5 cats start
        0:[
          [[7,3],[11,1],[12,1],[10,1],[21,2]],
          [[0,2],[11,1],[12,1],[13,1],[0,1]],
          [[15,2],[11,1],[12,1],[13,1],[25,1]],
          [[14,2],[14,1],[14,1],[13,1],[0,1]],
          [[11,2],[11,1],[9,1],[0,1],[6,1]],
          [[13,2],[17,1],[8,2],[0,3],[1,1]],
          [[13,3],[4,1],[5,1],[2,3],[3,3]],
        ],
        1:[[1,3,2,1],[4,3,2,4]],
        2:[[0,1,2,1],[0,2,2,2],[0,0,4,3],[0,0,3,4],[4,1,1,5]],
    },

    // { // test data 16 5 cats
    //     0:[
    //       [[0,3],[9,1],[10,1],[17,1],[18,1],[25,1]],
    //       [[0,1],[8,1],[11,1],[16,1],[19,1],[24,1]],
    //       [[0,1],[7,1],[12,1],[15,1],[20,1],[23,1]],
    //       [[0,1],[6,1],[13,1],[14,1],[21,1],[22,1]],
    //       [[0,1],[1,1],[2,1],[3,1],[4,1],[5,1]],
    //     ],
    //     2:[[0,1,1,1],[0,1,2,2],[0,1,3,3],[0,1,4,4],[0,1,5,5]],
    //     3:0
    // }
  ],
  prevMap:[],
  memap:{},
  // handle input
  moves:{ 37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1] },
  mbtn:{ t:0,x: 0, y: 0, w: 0, h: 0 },
  btn:[],
  g:0,
  ac:null
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