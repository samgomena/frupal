class Person {
  constructor(hero_init, map) {
    this.name = "I made this up";
    this.width = 64; // Magic for now
    this.height = 64;
    this.x = hero_init.pos.x;
    this.y = hero_init.pos.y;
    this.location = hero_init.pos;
    this.energy = hero_init.energy;
    this.money = hero_init.whiffles;
    this.items = hero_init.items;

    this.map = map;
    this.dead = false;

    // Player's possible movements
    this.up = { x: 0, y: -1 };
    this.down = { x: 0, y: 1 };
    this.left = { x: -1, y: 0 };
    this.right = { x: 1, y: 0 };

  }

  printStatus() {
    return `Name: ${this.name}\n`
            +`Location: (${this.x}, ${this.y})\n`
            +`Energy: ${this.energy}\n`
            +`Money: ${this.money}\n`;
  }

  getEnergy() {
    return this.energy;
  }

  getMoney() {
    return this.money;
  }

  getPlayerLocInfo() {
    return this.map.layers[(this.x * this.map.width) + this.y].terrain.name;
  }

  getPlayerLocCost() {
    return this.map.layers[(this.x * this.map.width) + this.y].terrain.cost;
  }
  
  getPlayerLocItem() {
    return this.map.layers[(this.x * this.map.width) + this.y].name;
  }
  getPlayerLoc() {
    return {
      x: this.x,
      y: this.y
    };
  }

  updateStatus(newLoc, energyCost) {
    this.location = newLoc;
    this.energy -= energyCost;
  }

  isDead() {
    this.dead = true;
  }

  /**
  * This function moves a player `dir_x` units in the x direction.
  *
  * @param dir_x The number of movements to take in the x direction
  */
  moveX(dir_x) {
    if (dir_x === 0)
      return 0;
    let moveX = this.x + dir_x;

    if(moveX >= this.map.width) {
      moveX = 0;
    }
    else if (moveX < 0) {
      moveX = this.map.width - 1;
    }
    let terrain = this.map.layers[((moveX) * this.map.width) + this.y].terrain;

    if (terrain.canEnter)
      this.x = moveX;
    return terrain.cost;
  }

  /**
   * This function moves a player `dir_y` units in the y direction.
   *
   * @param dir_y The number of movements to take in the y direction
   */
  moveY(dir_y) {
    if (dir_y === 0)
      return 0;
    let moveY = this.y + dir_y;

    if(moveY >= this.map.width) {
      moveY = 0;
    }
    else if (moveY < 0) {
      moveY = this.map.width - 1;
    }
    let terrain = this.map.layers[((this.x) * this.map.width) + moveY].terrain;

    if (terrain.canEnter)
      this.y = moveY;
    return terrain.cost;
  }

  // consumeEnergy should eventually take a tile type
  // as an argument to decide how much energy is lost
  // during movement.
  consumeEnergy(lost) {
    if(this.energy === 0) this.dead = true;
    this.energy -= lost;
  }

  /**
   * This function calls move updates for the x and y directions.
   *
   * @param step_x The number of movements to take in the x direction
   * @param step_y The number of movements to take in the y direction
   */
  move(step_x, step_y) {

    // These should probably be pure
    let costX = this.moveX(step_x);
    let costY = this.moveY(step_y);
    this.consumeEnergy(costX + costY);
  }
}

export default Person;

