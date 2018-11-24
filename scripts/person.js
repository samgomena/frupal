import { ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, TREASURE, BOAT, CHAINSAW, WEED_WHACKER } from "./data/items";

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
    this.inventory = hero_init.inventory;
    this.boat = false;

    this.map = map;
    this.dead = false;
    this.visibilityRadius = 1;  // number of squares visible in each direction.

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
    // Calculates the tile position using black magic. Ask Dan for explanation.
    return this.map.layers[(this.x * this.map.width) + this.y].terrain.name;
  }

  getPlayerLocCost() {
    return this.map.layers[(this.x * this.map.width) + this.y].terrain.cost;
  }

  getPlayerLocItem() {
    return this.map.layers[(this.x * this.map.width) + this.y].name;
  }

  getPlayerInventory() {
    return this.inventory;
  }

  getPlayerLoc() {
    return {
      x: this.x,
      y: this.y
    };
  }

  isDead() {
    this.dead = true;
  }

  hasBinoculars() {
    this.visibilityRadius = 2; //can see two squares in each direction now.
  }

  hasBoat() {
    this.boat = true;
  }

  checkInventory(itemToCheck) {
    var len = this.inventory.length;
    for(var i = 0; i < len; ++i)
    {
      if(itemToCheck == this.inventory[i]) {
        return true;
      }
    }
    return false;
  }

  addToInventory(item) {
    this.inventory.push(item);
    this.money -= 10;
    this.inventoryLength += 1;

    switch(item) {
    case BOAT:
      this.hasBoat();
      break;
    case BINOCULARS:
      this.hasBinoculars();
      break;
    }
  }

  giveItem(item) {
    // ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, TREASURE, BOAT, CHAINSAW, WEED_WHACKER
    // TODO: Might need this for obstacle-tool interaction?
    switch(item) {
    case BINOCULARS:
      this.hasBinoculars();
      break;
    }
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

    if (terrain.canEnter) {
      this.x = moveX;
    }
    else if (terrain.name === "WATER" && this.boat) {
      this.x = moveX;
      return 0;
    }

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

    if (terrain.canEnter) {
      this.y = moveY;
    }
    else if (terrain.name === "WATER" && this.boat) {
      this.y = moveY;
      return 0;
    }

    return terrain.cost;
  }

  consumeEnergy(lost) {
    if(this.energy === 0) this.dead = true;
    this.energy -= lost;
  }

  usePowerBar(gained) {
    this.energy += gained;
    this.map.layers[(this.x * this.map.width) + this.y].name = "";
  }

  findTreasure() {
    this.money += 100;

    //reset cell so treasure can't be found again
    this.map.layers[(this.x * this.map.width) + this.y].name = "";
  }

  //encounter a Type Two Treasure which takes all your money
  loseMoney(){
    this.money = 0;

    //reset cell so treasure can't be found again
    this.map.layers[(this.x * this.map.width) + this.y].name = "";
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
