"use strict";
import { ROYAL_DIAMONDS, BINOCULARS, POWER_BAR } from "./data/items";

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
    this.boat = false;	//boat should eventually be in inventory

    this.map = map;
    this.dead = false;
    this.visibilityRadius = 1;  // number of squares visible in each direction.

    // Player's possible movements
    this.up = { x: 0, y: -1 };
    this.down = { x: 0, y: 1 };
    this.left = { x: -1, y: 0 };
    this.right = { x: 1, y: 0 };

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

  getPlayerLoc() {
    return {
      x: this.x,
      y: this.y
    };
  }

  isDead() {
    this.dead = true;
  }

  useBinoculars() {
    this.visibilityRadius = 2;
  }

  usePowerBar(gained) {
    this.energy += gained;
  }

  hasBoat() {
    this.boat = true;
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
    let move = this.map.allowMove(moveX, this.y, this);

    if (move.allow) {
      this.x = moveX;
      
       if (move.object !== "None")
         this.interactWithObject(move.object);
    }
    return move.cost;
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
    let move = this.map.allowMove(this.x, moveY, this);

    if (move.allow) {
      this.y = moveY;
    }
    return move.cost;
  }

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

  interactWithObject(object) {
    switch(object) {

    case ROYAL_DIAMONDS:
      alert("You found the jewels!!!!!! You Win!!");
      //Reload the game to default
      window.location.reload(true);
      break;

    case BINOCULARS:
      console.log("You found a pair of binoculars!");
      this.useBinoculars();
      break;
    
    case POWER_BAR:
      // TODO: Consume power bar on tile move?
      console.log("Power Bar Found");
      this.usePowerBar(10);
    }
    this.map.destroyObject(this.x, this.y);
  }
}

export default Person;

