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
    return this.location;
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

  getPlayerLoc() {
      return this.location;
    }

  updateStatus(newLoc, energyCost) {
    this.location = newLoc;
    this.energy -= energyCost;
  }

  isDead() {
    this.dead = true;
  }

  // consumeEnergy should eventually take a tile type
  // as an argument to decide how much energy is lost
  // during movement.
  consumeEnergy(lost) {
    if(this.energy === 0) this.dead = true;
    this.energy -= lost;
  }

  move(step_x, step_y) {
      this.x += step_x * this.map.tile_size;
      this.y += step_y * this.map.tile_size;
  };
}

export default Person;

