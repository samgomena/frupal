import Person from "./person";
import Display from "./display";
import parse_config from "./parse_config";
import Game from "./game"
import { DEFAULT_PARAMS, Map } from "./map";
import createOverlay from "./overlay";
import "../styles/main.scss";

let game_config = parse_config.parse(parse_config.default_config);
let map = game_config.map;
let hero_init = game_config.player;

setTitle(game_config.title);
// createOverlay();
setMoveEvents();


let context = document.getElementById('demo').getContext('2d');
let hero = new Person("Ernesto", hero_init.pos, hero_init.energy, hero_init.whiffles, hero_init.items);

let game = new Game(context, map, hero);
game.run();

let HUD = new Display(hero, map);

// FIXME: We can probably sweep this elsewhere.
function moveEvent(moveId) {
  const up = { x: 0, y: 1 };
  const down = { x: 0, y: -1 };
  const left = { x: -1, y: 0 };
  const right = { x: 1, y: 0 };

  switch(moveId) {
  case "up":
  case "ArrowUp":
  case "w":
    map.movePlayer(up);
    break;
  case "down":
  case "ArrowDown":
  case "s":
    map.movePlayer(down);
    break;
  case "left":
  case "ArrowLeft":
  case "a":
    map.movePlayer(left);
    break;
  case "right":
  case "ArrowRight":
  case "d":
    map.movePlayer(right);
    break;
  default:
    throw new Error("Not an event!");
  }
  
  Hero.updateStatus(map.getPlayerLoc(), map.getTileCost());

  return HUD.update();
}

function setMoveEvents() {

  // Get up, down, left, right, elements and attach click events to them
  ["up", "down", "left", "right"].forEach(direction => {
      document.getElementById(direction).addEventListener("click", () => {
        moveEvent(direction);
      });
  });

  // e stands for event
  document.addEventListener("keydown", (e) => {
    // TODO: May want to debounce?
    // TODO: May want to use keyCode instead of button name
    const keyName = e.key;
    const validKeys = ["w", "a", "s", "d", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if(validKeys.indexOf(keyName) !== -1) {
        moveEvent(keyName, 1);
    }

  });
}

function setTitle(title) {
    document.getElementById("game-title").innerHTML = title;
}




