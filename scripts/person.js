class Person {
  constructor(hero_init, map) {
    this.name = "I made this up";
    this.width = 64; // Magic for now
    this.height = 64; // Magic for now
    this.x = hero_init.pos.x;
    this.y = hero_init.pos.y;
    this.location = hero_init.pos;
    this.energy = hero_init.energy;
    this.money = hero_init.whiffles;
    this.items = hero_init.items;

    this.map = map;
    this.dead = false;
  }

  printStatus() {
    return `Name: ${this.name}\n`
            +`Location: (${this.location.x},${this.location.y})\n`
            +`Energy: ${this.energy}\n`
            +`Money: ${this.money}\n`;
  }

  // FIXME: Move this method into the map class as getPlayerLocation
  getLocation() {
    return {
        x: this.x,
        y: this.y
    };
  }

  getEnergy() {
    return this.energy;
  }

  getMoney() {
    return this.money;
  }

  getPlayerLocInfo() {
      return this.map.layers[1][this.x * this.y].terrain.name;
  }

  getPlayerLocCost() {
    return this.map.layers[1][this.x * this.y].terrain.cost;
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

  moveX(dir_x) {
    this.x += dir_x;

    if(this.x >= this.map.width) {
        this.x = 0;
    }

    if(this.x < 0) {
        this.x = this.map.width - 1;
    }

    this.energy -= this.getPlayerLocCost();
  }

  moveY(dir_y) {
      this.y += dir_y;

      if(this.y >= this.map.width) {
          this.y = 0;
      }

      if(this.y < 0) {
          this.y = this.map.width - 1;
      }

      this.energy -= this.getPlayerLocCost();
  }

    // consumeEnergy should eventually take a tile type
  // as an argument to decide how much energy is lost
  // during movement.
  consumeEnergy(lost) {
    if(this.energy === 0) this.dead = true;
    this.energy -= lost;
  }

  move(step_x, step_y) {

    // These should probably be pure
    this.moveX(step_x);
    this.moveY(step_y);

  };
}

export default Person;

