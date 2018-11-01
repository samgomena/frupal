// Testing class inheritance in javascript
// Simple so far, we can add any type to any data structure
// and javascript will be ok with it. The could be the 
// datatype used for our map.

export default class Tile {
  constructor(config) {
    this.terrain = config.terrain;
    this.obstacle = config.obstacle;
    this.color = config.color;
    this.cost = config.cost;
    this.hidden = config.hidden;
    this.item = config.item;
  }
}
