// Testing class inheritance in javascript
// Simple so far, we can add any type to any data structure
// and javascript will be ok with it. The could be the 
// datatype used for our map.

class Tile {
  constructor(obstacle, color, cost, hidden) { 
    this.obstacle = obstacle;
    this.color = color;
    this.cost = cost;
    this.hidden = hidden;
  }
  printInfo() {
    return `Obstacle: ${this.obstacle}\n`
            +`Color: ${this.color}`;
  }
}

// Eventually getEvent() will be modified to return special items or messages to the player.
export class Meadow extends Tile {
  constructor(obstacle) {
    super(obstacle, [0, 255, 0], 1, true);
  }
  getEvent() {
    return this.cost;
  }
}

export class Water extends Tile {
  constructor(obstacle) {
    // FIXME: -1 may be a bit confusing.
    super(obstacle, [0, 0, 255], -1, true);
  }
  getEvent() {
    return this.cost;
  }
}

export class Swamp extends Tile {
  constructor(obstacle) {
    super(obstacle, [90, 90, 0], 4, true);
  }
  getEvent() {
    return this.cost;
  }
}

export class Bog extends Tile {
  constructor(obstacle) {
    super(obstacle, [90, 90, 0], 3, true);
  }
  getEvent() {
    return this.cost;
  }
}

export class Forest extends Tile {
  constructor(obstacle) {
    super(obstacle, [152, 251, 152], 2, true);
  }
  getEvent() {
    return this.cost;
  }
}
