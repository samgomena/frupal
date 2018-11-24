"use strict";
import { ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, TREASURE, BOAT, CHAINSAW, WEED_WHACKER } from "./data/items";
import hero_image from "../assets/charsets_12_characters_4thsheet_completed_by_antifarea.png";
import terrain_image from "../assets/roguelikeSheet_transparent.png";

// import { loseGame } from "./endGame";
/**
 * This class is responsible for initializing the height and width of the canvas element that serves as the
 * game board. It also binds event listeners to the keys responsible for moving the hero around the map.
 */
export default class Game {
  constructor(canvas, map, hero, display, fps=5) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.map = map;
    this.newTile = true;
    this.tileSize = 16;

    this.terrain_sprite = new Image();
    this.terrain_sprite.src = terrain_image;

    this.hero_sprite = new Image();
    this.hero_sprite.src = hero_image;

    this.sprite_width = 16;
    this.sprite_height = 16;

    this.hero_sprite_width = 16;
    this.hero_sprite_height = 16;

    // Initial start position is looking downwards.
    this.hero_frame_position = 2;

    // w a s d
    // up, left, down, right
    this.hero_frame_x = 48;
    this.hero_frame_y = [162, 145, 126, 108];

    this.hero_animation_frames = [32, 48, 64];
    // Start on 1.
    this.hero_animation_num = 1;
    this.hero_max_animation = 3;
    this.hero_animation_iterations = this.hero_max_animation;

    this.unknownFrameX = 816;
    this.unknownFrameY = 442;

    this.game_paused = false;

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
    ["up", "left", "down", "right"].forEach((direction, i) => {
      document.getElementById(direction).addEventListener("click", () => {
        if(!this.isGamePaused() && !this.isGameStopped()) {
          this.hero_frame_position = i;
          this.hero_animation_iterations = 0;
          this.moveEvent(direction);
        }
      });
    });

    // e stands for event
    document.addEventListener("keydown", e => {
      if(!this.isGamePaused() && !this.isGameStopped()) {
        // I wonder if using function calls like this impacts performance?
        const keyName = e.key;
        const validKeys = ["w", "a", "s", "d", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        let keyIndex = validKeys.indexOf(keyName);

        if(keyIndex !== -1) {
          e.preventDefault();
          // Key index mod 4 because that's how many keys there are.
          this.hero_frame_position = keyIndex % 4;
          this.hero_animation_iterations = 0;
          this.moveEvent(keyName, 1);
        }
      }
    });
  }

  isGamePaused() {
    return this.game_paused;
  }

  isGameStopped() {
    return this.game_stop;
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
    window.clearTimeout(this.tick);
  }


  /**
   * This function is responsible for executing game updates and rendering the updates.
   */
  tick() {
    if (this.game_stop) return 0;
    if (!this.game_paused) {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.update();

      if(this.newTile) {
        // Makes sure the player's tile is not constantly checked.
        this.tileCheck();
        this.display.update();
        this.newTile = false;
      }

      this.drawGrid();
      this.drawPlayer();
    }

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
      // Pause the game to allow for player to buy things.
      switch(item) {

      case ROYAL_DIAMONDS:
        this.stop();
        this.textPrompt("You found the Royal Diamonds! You Win!", () => {
        //Reload the game to default
          window.location.reload(true);
        });
        break;

      case BINOCULARS:
        this.buyPrompt("Would you like to buy binoculars?", item);
        break;
        
      case POWER_BAR:
        this.textPrompt("You found a power bar!");
        this.hero.usePowerBar(10);
        break;
        
      case TREASURE:
        console.log("Treasure Chest Found");
        this.textPrompt("You found treasure!");
        this.hero.findTreasure();
        break;
        
      case BOAT:
        // this.hero.addToInventory(item);
        this.buyPrompt("Would you like to buy a boat?", item);
        break;
        
      case CHAINSAW:
        this.hero.addToInventory(item);
        break;
      }
    }

  }

  buyPrompt(text, item) {
    this.game_paused = true;

    // This giant thing is just creating HTML elements to show up within the popup element.
    let popup = document.getElementById("popup");
    popup.style["display"] = "flex";
    const buy_text = document.createTextNode(`Would you like to buy ${item}?`);
    const buy_message = document.createElement("div");
    buy_message.appendChild(buy_text);
    const yes_no_box = document.createElement("div");
    const yes_text = document.createTextNode("Yes");
    const no_text = document.createTextNode("No");
    const yes = document.createElement("button");
    yes.appendChild(yes_text);
    const no = document.createElement("button");
    no.appendChild(no_text);
    yes_no_box.appendChild(yes);
    yes_no_box.appendChild(no);

    yes.addEventListener("click", () => {
      this.clearPopupAndUnpause(popup);
      this.hero.addToInventory(item);
    });

    no.addEventListener("click", this.clearPopupAndUnpause.bind(this));

    popup.appendChild(buy_message);
    popup.appendChild(yes_no_box);
  }

  textPrompt(text, eventHandler=this.clearPopupAndUnpause.bind(this)) {
    // Pause the game if the prompt shows up.
    this.game_paused = true;

    let popup = document.getElementById("popup");
    if (popup.innerHTML == "") {
      popup.style["display"] = "flex";
      const happy_text = document.createTextNode(text);
      const ok_text = document.createTextNode("Okay");
      const ok_button = document.createElement("button");
      ok_button.appendChild(ok_text);
      popup.appendChild(happy_text);
      popup.appendChild(ok_button);
      ok_button.addEventListener("click", eventHandler);
    }
  }

  clearPopupAndUnpause() {
    let popup = document.getElementById("popup");
    popup.style["display"] = "none";
    popup.innerHTML = "";
    // Unpause game
    this.game_paused = false;
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
        this.stop();
        this.textPrompt("Oh dear, you are dead!", () => {
          window.location.reload(true);
        });
      }
    });
  }

  /**
   * This function draws the 'hero' (a circle for now)
   */
  drawPlayer() {
    let hero_x = (this.hero.x * this.map.tile_size);
    let hero_y = (this.hero.y * this.map.tile_size);

    // Prevents hero moving animation from constantly occurring.
    if(this.hero_animation_iterations < (this.hero_max_animation)) {
      this.hero_animation_iterations += 1;
      this.hero_animation_num = (this.hero_animation_num + 1) % this.hero_max_animation;
      // Hero frame position is tied to the movement events.
      this.ctx.drawImage(this.hero_sprite, this.hero_animation_frames[this.hero_animation_num], this.hero_frame_y[this.hero_frame_position], 
        this.hero_sprite_width, this.hero_sprite_height, hero_x, hero_y, this.tileSize, this.tileSize);
    }
    else {
      this.ctx.drawImage(this.hero_sprite, this.hero_frame_x, this.hero_frame_y[this.hero_frame_position], 
        this.hero_sprite_width, this.hero_sprite_height, hero_x, hero_y, this.tileSize, this.tileSize);
    }
  }

  /**
   * This function draws the grid on the game's canvas element.
   *
   * Each tile on the grid is defined by the maps `tile_size`.
   */
  drawGrid() {
    for (let cellX = 0; cellX < this.map.height; ++cellX)
    {
      for (let cellY = 0; cellY < this.map.width; ++cellY)
      {
        let visible = this.map.layers[(cellX * this.map.width) + cellY].visible;
        let toDrawX = this.unknownFrameX;
        let toDrawY = this.unknownFrameY;
        if (visible) {
          let terrain = this.map.layers[(cellX * this.map.width) + cellY].terrain;
          toDrawX = terrain.frameX;
          toDrawY = terrain.frameY;
        }
        this.ctx.drawImage(this.terrain_sprite, toDrawX, toDrawY, this.sprite_width, this.sprite_height, 
        (cellX * this.map.tile_size) + 1, (cellY * this.map.tile_size) + 1, this.tileSize, this.tileSize);
      }
    }
  }
}
