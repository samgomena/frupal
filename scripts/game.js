"use strict";
import { ROYAL_DIAMONDS, BINOCULARS, POWER_BAR, TREASURE, 
  TYPE_TWO, BOAT, CHAINSAW, WEED_WHACKER, TREE, BLK_BERRY, BOULDER } from "./data/items";
import hero_image from "../assets/charsets_12_characters_4thsheet_completed_by_antifarea.png";
import balloons from "../assets/balloons.png";
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

    this.balloon_sprite = new Image();
    this.balloon_sprite.src = balloons;

    this.sprite_width = 16;
    this.sprite_height = 16;

    this.balloon_animations = [112, 96, 80, 64, 48, 32, 16, 0];
    this.balloon_animation_max = 8;
    this.balloon_animation_frame = 0;
    this.balloon_animation_num = 0;

    // Question mark, exclamation point, ellipses, heart.
    this.balloon_type = [0, 16, 32, 48];
    // If balloon_flag == -1, don't show a flag.
    this.balloon_flag = -1;

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

    // Unknown frames for unknown map tiles.
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
        let tile = this.map.tiles[(cellX * this.map.width) + cellY];
        tile.visible = true;
      }
    }
    this.revealMap();
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

    if(this.balloon_flag !== -1) {
      this.drawBalloon();
    }

    if (!this.game_paused) {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.update();

      if(this.newTile) {
        // Makes sure the display is not constantly updated and repainted..
        this.display.update();
        this.newTile = false;
      }

      this.drawGrid();
      this.drawPlayer();
    }

    // requestAnimationFrame(this.tick.bind(this));
    window.setTimeout(this.tick.bind(this), 1000/this.fps);
  }

  /**
   * This function consumes the move events in `hero_move_queue` and executes them sequentially.
   */
  update() {
    this.hero_move_queue.forEach(movement => {
      if (this.hero.getEnergy() > 1) {
        let allowMove = this.map.allowMove(this.hero.x + movement.x, this.hero.y + movement.y, this.hero);
        if(allowMove.allow) {
          this.hero.move(movement.x, movement.y, allowMove.cost);
        }
        if(allowMove.object != "None") {
          this.tileCheck(allowMove.object, this.hero.x + movement.x, this.hero.y + movement.y, allowMove.cost);
        }
        this.hero_move_queue.shift();

        this.revealMap();
      }
      else {
        this.stop();
        this.textPrompt("Oh dear, you are dead!", () => {
          window.location.reload(true);
        });
      }
    });
  }

  tileCheck(obj, x, y, move_cost) {
    /*
      Checks the tile that the hero is on.
    */
    var invCheck = this.hero.checkInventory(obj);
    if(invCheck === false) {  //obj not already in the player's inventory
      // Pause the game to allow for player to buy things.
      switch(obj.name) {
      case TREE.name:
      case BLK_BERRY.name:
      case BOULDER.name:
      // TODO: Check if player has tools to break down, 
      // consume appropriate energy by calling a movement on this.hero.x - x (?).
        this.obstaclePrompt(obj, x, y);
        break;
      case POWER_BAR.name:
      case BOAT.name:
      case BINOCULARS.name:
      case WEED_WHACKER.name:
        this.buyPrompt(obj, x, y);
        break;
      case ROYAL_DIAMONDS.name:
        this.stop();
        this.textPrompt("You found the Royal Diamonds! You Win!", () => {
        //Reload the game to default
          window.location.reload(true);
        });
        break;

      case TREASURE.name:
        console.log("Treasure Chest Found");
        this.textPrompt("You found treasure!");
        //reset cell so treasure can't be found again
        this.map.destroyObject(x, y);
        this.hero.findTreasure();
        this.hero.move(x - this.hero.x, y - this.hero.y, move_cost);
        break;

      case TYPE_TWO.name:
        console.log("Type 2 chest found...lose all money");

        // Temp fix for now.
        this.balloon_flag = 2;
        this.textPrompt("Sorry, all your whiffles have been stolen :(");
        this.hero.loseMoney();
        this.map.destroyObject(x, y);
        break;

      default:
        throw("Could not find object");
      }

    }
  }

  obstaclePrompt(obj, x, y) {
    this.game_paused = true;
    this.balloon_flag = 1;

    let popup = document.getElementById("popup");
    popup.style["display"] = "flex";
    const remove_text = document.createTextNode(`Would you like to remove ${obj}?`);
    const remove_message = document.createElement("div");
    remove_message.appendChild(remove_text);
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
      this.map.destroyObject(x, y);
    });

    no.addEventListener("click", this.clearPopupAndUnpause.bind(this));

    popup.appendChild(remove_message);
    popup.appendChild(yes_no_box);

  }

  buyPrompt(item, x, y) {
    this.game_paused = true;
    this.balloon_flag = 1;

    // This giant thing is just creating HTML elements to show up within the popup element.
    let popup = document.getElementById("popup");
    popup.style["display"] = "flex";
    const buy_text = document.createTextNode(`Would you like to buy ${item.name}?`);
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
      let moneyCost = item.cost;
      if(this.hero.getMoney() >= moneyCost){
        this.hero.addToInventory(item, moneyCost);
        this.map.destroyObject(x, y);
      }
      else {
        this.textPrompt("Not enough money");
      }
    });

    no.addEventListener("click", this.clearPopupAndUnpause.bind(this));

    popup.appendChild(buy_message);
    popup.appendChild(yes_no_box);

  }

  textPrompt(text, eventHandler=this.clearPopupAndUnpause.bind(this)) {
    // Pause the game if the prompt shows up.
    this.game_paused = true;
    
    // Temp fix for finding type2 treasure.
    if(this.balloon_flag == -1) {
      this.balloon_flag = 3;
    }

    let popup = document.getElementById("popup");
    if (popup.innerHTML == "") {
      popup.style["display"] = "flex";
      const happy_text = document.createTextNode(text);
      const ok_text = document.createTextNode("Okay");
      const ok_button = document.createElement("button");
      ok_button.appendChild(ok_text);
      popup.appendChild(happy_text);
      popup.appendChild(ok_button);
      ok_button.addEventListener("click", () => {
        eventHandler();
      });
    }
  }

  clearPopupAndUnpause() {
    let popup = document.getElementById("popup");
    popup.style["display"] = "none";
    popup.innerHTML = "";
    // Unpause game
    this.game_paused = false;
  }

  resetBalloon() {
    this.balloon_flag = -1;
    this.balloon_animation_frame = 0;
    this.balloon_animation_num = 0;
  }


  //TODO optimize and refactor
  revealMap() {
    let showLeft = this.hero.x - this.hero.visibilityRadius;
    let showRight = this.hero.x + this.hero.visibilityRadius;
    let showDown = this.hero.y - this.hero.visibilityRadius;
    let showUp = this.hero.y + this.hero.visibilityRadius;

    let minX = Math.max(0, showLeft);
    let minY = Math.max(0, showDown);
    let maxX = Math.min(this.map.width - this.hero.visibilityRadius, showRight);
    let maxY = Math.min(this.map.height - this.hero.visibilityRadius, showUp);

    //This fixes the binoculars issue at the edge of the map.
    if (maxX >= this.map.width - 3)
      ++maxX;
    if (maxY >= this.map.height - 3)
      ++maxY;

    //Basic cell visibility, no wrap around.
    for (let cellX = minX; cellX <= maxX; ++cellX)
    {
      for (let cellY = minY; cellY <= maxY; ++cellY)
      {
        this.map.showTile(cellX, cellY);
      }
    }
    //Wrap around map off left side (show right)
    if (showLeft < 0)
    {
      let tempX = this.map.width - 1;
      for (let tempY = minY; tempY <= maxY; ++tempY)
      {
        let tile = this.map.tiles[(tempX * this.map.width) + tempY];
        tile.visible = true;
      }
      //wrap around visibility with binoculars
      if (showLeft == -2)
      {
        --tempX;
        for (let tempY = minY; tempY <= maxY; ++tempY)
        {
          let tile = this.map.tiles[(tempX * this.map.width) + tempY];
          tile.visible = true;
        }
      }
    }
    //Wrap around map off right side (show left)
    if (showRight >= this.map.width)
    {
      let tempX = 0;
      for (let tempY = minY; tempY <= maxY; ++tempY)
      {
        let tile = this.map.tiles[(tempX * this.map.width) + tempY];
        tile.visible = true;
      }
      //wrap around visibility with binoculars
      if (showRight == this.map.width + 1)
      {
        ++tempX;
        for (let tempY = minY; tempY <= maxY; ++tempY)
        {
          let tile = this.map.tiles[(tempX * this.map.width) + tempY];
          tile.visible = true;
        }
      }
    }
    //Wrap around map off bottom (show top)
    if (showDown < 0)
    {
      let tempY = this.map.height - 1;
      for (let tempX = minX; tempX <= maxX; ++tempX)
      {
        let tile = this.map.tiles[(tempX * this.map.width) + tempY];
        tile.visible = true;
      }
      //wrap around visibility with binoculars
      if (showDown == -2)
      {
        --tempY;
        for (let tempX = minX; tempX <= maxX; ++tempX)
        {
          let tile = this.map.tiles[(tempX * this.map.width) + tempY];
          tile.visible = true;
        }
      }
    }
    //Wrap around map off top (show bottom)
    if (showUp >= this.map.height)
    {
      let tempY = 0;
      for (let tempX = minX; tempX <= maxX; ++tempX)
      {
        let tile = this.map.tiles[(tempX * this.map.width) + tempY];
        tile.visible = true;
      }
      //wrap around visibility with binoculars
      if (showLeft == -2)
      {
        ++tempY;
        for (let tempX = minX; tempX <= maxX; ++tempX)
        {
          let tile = this.map.tiles[(tempX * this.map.width) + tempY];
          tile.visible = true;
        }
      }
    }
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

  drawBalloon() {
    let hero_x = (this.hero.x * this.map.tile_size);
    let hero_y = (this.hero.y * this.map.tile_size);
    if(this.balloon_animation_num < (this.balloon_animation_max)) {
      this.ctx.drawImage(this.balloon_sprite, this.balloon_animations[this.balloon_animation_frame], this.balloon_type[this.balloon_flag], this.tileSize, this.tileSize, 
        hero_x, hero_y + this.tileSize, this.tileSize, this.tileSize);

      this.balloon_animation_num += 1;
      this.balloon_animation_frame = (this.balloon_animation_frame + 1) % this.balloon_animation_max;
    }
    else {
      this.ctx.drawImage(this.balloon_sprite, this.balloon_animations[this.balloon_animation_max - 1], this.balloon_type[this.balloon_flag], this.tileSize, this.tileSize, 
        hero_x, hero_y + this.tileSize, this.tileSize, this.tileSize);
      this.resetBalloon();
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
        let visible = this.map.tiles[(cellX * this.map.width) + cellY].visible;
        let toDrawX = this.unknownFrameX;
        let toDrawY = this.unknownFrameY;
        if (visible) {
          let terrain = this.map.tiles[(cellX * this.map.width) + cellY].terrain;
          toDrawX = terrain.frameX;
          toDrawY = terrain.frameY;
        }
        this.ctx.drawImage(this.terrain_sprite, toDrawX, toDrawY, this.sprite_width, this.sprite_height,
          (cellX * this.map.tile_size) + 1, (cellY * this.map.tile_size) + 1, this.tileSize, this.tileSize);
      }
    }
  }
}
