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
    return this.map.layers[this.x * this.y].terrain.name;
  }

  getPlayerLocCost() {
    return this.map.layers[this.x * this.y].terrain.cost;
  }
  
  getPlayerLocItem() {
    return this.map.layers[this.x * this.y].terrain.cost;
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
    this.x += dir_x;

    if(this.x > this.map.width) {
      // FIXME: Should this not be 0?
      this.x = 1;
    }

    if(this.x < 1) {
      this.x = this.map.width;
    }

  }

  /**
     * This function moves a player `dir_y` units in the y direction.
     *
     * @param dir_y The number of movements to take in the y direction
     */
  moveY(dir_y) {
    this.y += dir_y;

    if(this.y > this.map.width) {
      // FIXME: Should this not be 0?
      this.y = 1;
    }

    if(this.y < 1) {
      this.y = this.map.width;
    }

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
    this.moveX(step_x);
    this.moveY(step_y);
    this.consumeEnergy(this.getPlayerLocCost());
  }
}

export default Person;

