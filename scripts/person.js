import { ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, 
  TYPE_ONE_TREASURE, BOAT, CHAINSAW, WEED_WHACKER, TREE, BOULDER, BLACK_BERRY_BUSH } from "./data/items";

class Person {
  constructor(hero_init, map) {
    this.name = "I made this up";
    this.width = 16; // Magic for now
    this.height = 16;
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
    this.interact = {x: 0, y: 0, flag: 1};

    this.mapX = this.x * this.map.width;
    this.mapY = this.y;
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

  //Returns a string representation of the terrain at the given x,y coordinates
  getPlayerLocInfo() {
    return this.map.getTerrainName(this.x, this.y);
  }

  //Returns the int cost of moving into the terrain at the given x,y coordinates
  getPlayerLocCost() {
    return this.map.getTerrainCost(this.x, this.y);
  }
  
  //Returns a string representation of the item or obstacle at the given x,y coordinates
  getPlayerLocItem() {
    return this.map.getObjectAtLoc(this.x, this.y);
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

  died() {
    this.dead = true;
  }

  isDead() {
    return this.dead;
  }

  // Not sure which one to remove, lol
  hasBinoculars() {
    this.visibilityRadius = 2; //can see two squares in each direction now.
  }

  hasBoat() {
    this.boat = true;
  }

  obstacleInteraction(obstacle) {
    const numTools = obstacle.rightTools.length;

/*  const obstacles = [TREE, BLACK_BERRY_BUSH, BOULDER];
    const itemsToCheck = obstacles.filter((obj) => {
      return obj.name == obstacle.name;
    })[0].rightTools;
*/
    let hasItem = false;
    let cost = obstacle.noToolsCost;
    for(let i = 0; i < numTools; ++i) {
      if(this.checkInventory(obstacle.rightTools[i])) {
        // TODO: Remove item from inventory on use
        cost = obstacle.reducedCost;
        hasItem = true;
      }
    }
    return {
      cost: cost,
      hasItem: hasItem
    };
  }

  boatStatus() {
    return this.boat;
  }

  checkInventory(itemToCheck) {
    var len = this.inventory.length;
    for(var i = 0; i < len; ++i)
    {
      if(itemToCheck == this.inventory[i].name) {
        return true;
      }
    }
    return false;
  }

  addToInventory(item, cost) {
    // Can turn this into the actual object later for displaying image
    this.inventory.push(item);
    this.money -= cost;
    this.inventoryLength += 1;

    switch(item.name) {
    case BOAT.name:
      this.hasBoat();
      break;
    case BINOCULARS.name:
      console.log(BINOCULARS);
      this.hasBinoculars();
      break;
    }
  }

  giveItem(item) {
    // ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, TYPE_ONE_TREASURE, BOAT, CHAINSAW, WEED_WHACKER
    // TODO: Might need this for obstacle-tool interaction?
    switch(item) {
    case BINOCULARS.name:
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
    /*
    let move = this.map.allowMove(moveX, this.y, this);

    if (move.allow) {
      this.x = moveX;
    }
    return move.cost;
    */
    this.x = moveX;
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
    /*
    let move = this.map.allowMove(this.x, moveY, this);

    if (move.allow) {
      this.y = moveY;
    }
    return move.cost;
    */
    this.y = moveY;
  }

  consumeEnergy(lost) {
    if(this.energy === 0) this.dead = true;
    this.energy -= lost;
  }

  usePowerBar(gained) {
    this.money -= 1;
    this.energy += gained;
  }

  findTreasure() {
    this.money += 100;

  }

  //encounter a Type Two Treasure which takes all your money
  loseMoney(){
    this.money = 0;
  }

  /**
   * This function calls move updates for the x and y directions.
   *
   * @param step_x The number of movements to take in the x direction
   * @param step_y The number of movements to take in the y direction
   */
  move(step_x, step_y, cost) {

    // These should probably be pure
    this.moveX(step_x);
    this.moveY(step_y);
    this.consumeEnergy(cost);
  }
  /*
  interactWithObject(object) {
    switch(object) {

    case ROYAL_DIAMONDS:
      alert("You found the jewels!!!!!! You Win!!");
      //Reload the game to default
      window.location.reload(true);
      break;

    case BINOCULARS:
      console.log("You found a pair of binoculars!");
      this.hasBinoculars();
      break;
    
    case POWER_BAR:
      // TODO: Consume power bar on tile move?
      console.log("Power Bar Found");
      this.usePowerBar(10);
    }
    this.map.destroyObject(this.x, this.y);
  }
  */
}

export default Person;
