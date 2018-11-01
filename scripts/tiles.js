// Testing class inheritance in javascript
// Simple so far, we can add any type to any data structure
// and javascript will be ok with it. The could be the 
// datatype used for our map.

export default class Tile {
  constructor(terrain, obstacle, color, cost, hidden) { 
    this.terrain = terrain;
    this.obstacle = obstacle;
    this.color = color;
    this.cost = cost;
    this.hidden = hidden;
  }
}
