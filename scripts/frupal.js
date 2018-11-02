import Person from "./person";
import Display from "./display";
import { Map, DEFAULT_PARAMS } from "./map";
import createOverlay from "./overlay";
import "../styles/main.scss";

let Hero = new Person("Ben", {x:0,y:0}, 100, 100); 
let map = new Map(DEFAULT_PARAMS);
let HUD = new Display(Hero, map);

// TODO: Change the name of this file to something like "main"

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



createOverlay();
setMoveEvents();
