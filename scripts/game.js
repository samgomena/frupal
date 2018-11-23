"use strict";
import { ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, TREASURE, BOAT, CHAINSAW, WEED_WHACKER } from "./data/items";
import { request } from "https";

// import { loseGame } from "./endGame";
/**
 * This class is responsible for initializing the height and width of the canvas element that serves as the
 * game board. It also binds event listeners to the keys responsible for moving the hero around the map.
 */
export default class Game {
  constructor(canvas, map, hero, display, fps=30) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.map = map;
    this.newTile = true;

    // Setting fps > 10 causes serious overallocation of resources
    this.fps = fps;

    this.hero = hero;

    // Queue that propagates move events across game refreshes
    this.hero_move_queue = [];

    this.display = display;

    this.game_loop = null;

    // Bind move events
    this.setMoveEvents();
    

    canvas.width = (this.map.tile_size * this.map.width);
    canvas.height = (this.map.tile_size * this.map.height);
    this.ctx.translate(0, canvas.height);
    this.ctx.scale(1, -1);

    window.addEventListener("load", this.sizeUpBoard.bind(this), false);
    window.addEventListener("resize", this.sizeUpBoard.bind(this), false);
  }

  moveEvent(moveId) {
    this.newTile = true;
    switch(moveId) {
    case "up":
    case "ArrowUp":
    case "w":
      this.hero_move_queue.push(this.hero.down);
      break;
    case "down":
    case "ArrowDown":
    case "s":
      this.hero_move_queue.push(this.hero.up);
      break;
    case "right":
    case "ArrowRight":
    case "d":
      this.hero_move_queue.push(this.hero.right);
      break;
    case "left":
    case "ArrowLeft":
    case "a":
      this.hero_move_queue.push(this.hero.left);
      break;
    default:
      throw new Error("That key doesn't do anything!");
    }
  }

  setMoveEvents() {

    // Define up, down, left, right, elements and attach click events to them
    ["up", "down", "left", "right"].forEach(direction => {
      document.getElementById(direction).addEventListener("click", () => {
        this.moveEvent(direction);
      });
    });

    // e stands for event
    document.addEventListener("keydown", e => {
      const keyName = e.key;
      const validKeys = ["w", "a", "s", "d", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

      if(validKeys.indexOf(keyName) !== -1) {
        this.moveEvent(keyName, 1);
      }
    });
  }

  /**
   * This function dynamically sets the games canvas element size and bitmap resolution.
   */
  sizeUpBoard() {
    // Canvas height fills screen regardless of resolution
    let height = window.innerHeight;

    // Scale resolution
    let ratio = this.canvas.width / this.canvas.height;
    let width = height * ratio;

    // Update canvas element's bitmap resolution
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    window.display.w = width;
    window.display.h = height;
  }

  /**
   * This function is the main entry point for `Game` class.
   *
   * It defines the event loop (`setTimeout(...)`) with a callback to the
   * tick function that's bound to a `game` instance.
   *
   * It runs the game loop indefinitely at `this.fps` frames per second.
   */
  run() {
    // Bind `tick` to `Game` so `this` is not `window`
    let minX = Math.max(0, this.hero.x - 1);
    let minY = Math.max(0, this.hero.y - 1);
    let maxX = Math.min(this.map.width - 1, this.hero.x + 1);
    let maxY = Math.min(this.map.height - 1, this.hero.y + 1);

    // Initial Visibility
    for (let cellX = minX; cellX <= maxX; ++cellX)
    {
      for (let cellY = minY; cellY <= maxY; ++cellY)
      {
        let tile = this.map.layers[(cellX * this.map.width) + cellY];
        tile.visible = true;
      }
    }
    this.game_loop = window.setTimeout(this.tick.bind(this), 1000/this.fps);
    // requestAnimationFrame(this.tick.bind(this));
  }

  stop() {
    this.game_stop = true;
  }


  /**
   * This function is responsible for executing game updates and rendering the updates.
   */
  tick() {
    if(this.game_stop) return 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.update();

    if(this.newTile) {
      // Makes sure the player's tile is not constantly checked.
      this.tileCheck();
      this.newTile = false;
    }

    this.display.update();
    this.drawGrid();
    this.drawPlayer();

    // requestAnimationFrame(this.tick.bind(this));
    window.setTimeout(this.tick.bind(this), 1000/this.fps);
  }

  tileCheck() {
    /*
      Checks the tile that the hero is on.
    */
    const item = this.hero.getPlayerLocItem();
    var invCheck = this.hero.checkInventory(item);
    if(invCheck === false) {  //item not already in the player's inventory

      switch(item) {

      case ROYAL_DIAMONDS:
        console.log("Diamonds Found");
        alert("You found the Royal Diamonds! You Win!!");
        //Reload the game to default
        window.location.reload(true);
        break;

      case BINOCULARS:
        this.hero.addToInventory(item);
        break;
        
      case POWER_BAR:
        alert("Power Bar Found");
        this.hero.usePowerBar(10);
        break;
        
      case TREASURE:
        console.log("Treasure Chest Found");
        this.hero.findTreasure();
        break;
        
      case BOAT:
        this.hero.hasBoat();
        this.hero.addToInventory(item);
        break;
        
      case CHAINSAW:
        alert("You found a chainsaw");
        this.hero.addToInventory(item);
        break;
      }
    }

  }

  /**
   * This function consumes the move events in `hero_move_queue` and executes them sequentially.
   */
  update() {
    this.hero_move_queue.forEach(movement => {
      if (this.hero.getEnergy() > 1) {
        this.hero.move(movement.x, movement.y);
        this.hero_move_queue.shift();

        let minX = Math.max(0, this.hero.x - this.hero.visibilityRadius);
        let minY = Math.max(0, this.hero.y - this.hero.visibilityRadius);
        let maxX = Math.min(this.map.width - this.hero.visibilityRadius, this.hero.x + this.hero.visibilityRadius);
        let maxY = Math.min(this.map.height - this.hero.visibilityRadius, this.hero.y + this.hero.visibilityRadius);

        for (let cellX = minX; cellX <= maxX; ++cellX)
        {
          for (let cellY = minY; cellY <= maxY; ++cellY)
          {
            let tile = this.map.layers[(cellX * this.map.width) + cellY];
            tile.visible = true;
          }
        }
      }
      else {
        let popup = document.getElementById("popup");
        popup.style["display"] = "block";
        const dead_text = document.createTextNode("You are already dead.");
        const ok_text = document.createTextNode("Okay :C");
        const ok_button = document.createElement("button");
        ok_button.appendChild(ok_text);
        popup.appendChild(dead_text);
        popup.appendChild(ok_button);

        ok_button.addEventListener("click", () => {
          //Reload the game to default
          window.location.reload(true);
        });

        this.hero.isDead();
        this.stop();
      }
    });
  }

  /**
   * This function draws the 'hero' (a circle for now)
   */
  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.arc(
      (this.hero.x * this.map.tile_size) + (this.hero.width / 2),
      (this.hero.y * this.map.tile_size) + (this.hero.height / 2),
      31,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * This function draws the grid on the game's canvas element.
   *
   * Each tile on the grid is defined by the maps `tile_size`.
   */
  drawGrid() {
    let width = this.map.width * this.map.tile_size;
    let height = this.map.height * this.map.tile_size;
    let x, y;

    // Draw horizontal grid lines
    //Uses range 0 - map.height inclusive to draw borders (#cells + 1)
    for (let step_x = 0; step_x <= this.map.height; ++step_x) {
      y = step_x * this.map.tile_size;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Draw vertical grid lines
    //Uses range 0 - map.width inclusive to draw borders (#cells + 1)
    for (let step_y = 0; step_y <= this.map.width; ++step_y) {
      x = step_y * this.map.tile_size;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    this.ctx.font = "30px ariel";
    for (let cellX = 0; cellX < this.map.height; ++cellX)
    {
      for (let cellY = 0; cellY < this.map.width; ++cellY)
      {
        let visible = this.map.layers[(cellX * this.map.width) + cellY].visible;
        let terrain = this.map.layers[(cellX * this.map.width) + cellY].terrain;

        this.ctx.beginPath();
        this.ctx.fillStyle = visible ? terrain.color : "burlywood";
        this.ctx.rect(
          (cellX * this.map.tile_size) + 1,
          (cellY * this.map.tile_size) + 1,
          this.map.tile_size - 1,
          this.map.tile_size - 1);
        this.ctx.stroke();
        this.ctx.fill();

        if (visible)
        {
          this.ctx.scale(1, -1);
          this.ctx.beginPath();
          this.ctx.fillStyle = "black";
          this.ctx.fillText(
            terrain.name.charAt(0),
            (cellX * this.map.tile_size) + (this.map.tile_size / 2),
            this.map.height + 1 - ((cellY * this.map.tile_size) + this.map.tile_size));
          this.ctx.stroke();
          this.ctx.scale(1, -1);
        }
      }
    }
  }
}
