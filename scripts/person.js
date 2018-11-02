class Person {
  constructor(name, location, energy, money, items) {
    this.name = name;
    this.width = 64;
    this.height = 64;
    this.x = location.x;
    this.y = location.y;
    this.location = location;
    this.energy = energy;
    this.money = money;
    this.items = items;
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
}

export default Person;

