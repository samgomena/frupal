export class Map {
  constructor(params) {
    this.map = [];
    this.params = params;
    this.playerLoc = params.playerLoc;
  }

  populate() {
    // FIXME: Pretty inefficient.
    for(let i = 0; i < this.params.max; i++) {
      let row = [];
      for(let j = 0; j < this.params.max; j++) {
        row.push("#");
      }
      this.map.push(row);
    }
  }

  movePlayer(movement) {
    this.playerLoc.x += movement.x;
    this.playerLoc.y += movement.y;

    if(this.playerLoc.x < 0) {
      this.playerLoc.x = this.params.max;
    }

    if(this.playerLoc.y < 0) {
      this.playerLoc.y = this.params.max;
    }
  }
}

export let DEFAULT_PARAMS = {
  max: 5,
  playerLoc: {
    x: 0,
    y: 0
  }
};