class Person {
  constructor(name, location, energy, money) {
    this.name = name;
    this.location = location;
    this.energy = energy;
    this.money = money;
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
      x: this.location.x,
      y: this.location.y
    };
  }

  getEnergy() {
    return this.energy;
  }

  getMoney() {
    return this.money;
  }

  goUp() {
    --this.location.y;
  }

  goDown() {
    ++this.location.y;
  }

  goLeft() {
    --this.location.x;
  }

  goRight() {
    ++this.location.x;
  }

  // consumeEnergy should eventually take a tile type
  // as an argument to decide how much energy is lost
  // during movement.
  consumeEnergy(lost) {
    if(this.energy == 0) this.dead = true;
    this.energy -= lost;
  }
}

export default Person;