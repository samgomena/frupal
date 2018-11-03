import Tile from "./tile";

export class Map {
  constructor(map_init) {
    this.map = map_init;
    this.height = map_init.height;
    this.width = map_init.width;
    this.tile_size = 64; // Magic for now

    // this.populate();
  }

//   populate() {
//     let defaultTile = {
//       terrain: "meadows",
//       cost: 1,
//       obstacle: undefined,
//       color: "#32CD32",
//       hidden: true,
//       item: undefined
//     };
//
//     for(let i = 0; i < this.params.max; i++) {
//       let row = [];
//       for(let j = 0; j < this.params.max; j++) {
//         row.push(new Tile(defaultTile));
//       }
//       this.map.push(row);
//       // console.log(row[i].terrain);
//     }
//   }
//
//   getPlayerLocInfo() {
//     let x = this.playerLoc.x;
//     let y = this.playerLoc.y;
//     return this.map[y][x].terrain;
//   }
//
//   getPlayerLoc() {
//     return this.playerLoc;
//   }
//
//   getTileCost() {
//     let x = this.playerLoc.x;
//     let y = this.playerLoc.y;
//     return this.map[y][x].cost;
//   }
//
//   movePlayer(movement) {
//     this.playerLoc.x += movement.x;
//     this.playerLoc.y += movement.y;
//
//     if(this.playerLoc.x >= this.params.max) {
//       this.playerLoc.x = 0;
//     }
//
//     if(this.playerLoc.x < 0) {
//       this.playerLoc.x = this.params.max - 1;
//     }
//
//     if(this.playerLoc.y >= this.params.max) {
//       this.playerLoc.y = 0;
//     }
//
//     if(this.playerLoc.y < 0) {
//       this.playerLoc.y = this.params.max - 1;
//     }
//   }
}

export let DEFAULT_PARAMS = {
  max: 25,
  playerLoc: {
    x: 0,
    y: 0
  }
};