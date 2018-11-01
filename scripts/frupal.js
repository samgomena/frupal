import Person from "./person";
import Display from "./display";
import { Map, DEFAULT_PARAMS } from "./map";
import createOverlay from "./overlay";
import "../styles/main.scss";

let Hero = new Person("Ben", {x:0,y:0}, 100, 100); 
let map = new Map(DEFAULT_PARAMS);
let HUD = new Display(Hero, map);

// TODO: Change the name of this file to something like "main"

// FIXME: Find a place to put the dead status check.
// FIXME: We can probably sweep this elsewhere.
/*
 FIXME: Not sure if map should keep track of player movement, or if the
 player should update the map in regards to its position.
*/

function moveEvent(moveId) {
  const up = { x: 0, y: 1 };
  const down = { x: 0, y: -1 };
  const left = { x: -1, y: 0 };
  const right = { x: 1, y: 0 };

  switch(moveId) {
  case "up":
  case "w":
    map.movePlayer(up);
    break;
  case "down":
  case "s":
    map.movePlayer(down);
    break;
  case "left":
  case "a":
    map.movePlayer(left);
    break;
  case "right":
  case "d":
    map.movePlayer(right);
    break;
  default:
    throw new Error("Not an event!");
  }
  
  Hero.updateStatus(map.getPlayerLoc(), map.getTileCost());

  if(HUD.update()) {
    return true;
  }
  else {
    return false;
  }
}

function setMoveEvents() {
  // FIXME: A bit clunky, but whatever.
  let upEl = document.getElementById("up");
  let downEl = document.getElementById("down");
  let leftEl = document.getElementById("left");
  let rightEl = document.getElementById("right");

  // TODO: Make a master Events thing to let events pass through.

  // TODO: Eventually replace 1 with a function which grabs tile energy cost
  // As in allow the moveEvent function to call the getTileEnergy function inside of itself.
  upEl.addEventListener("click", () => moveEvent("up"));
  downEl.addEventListener("click", () => moveEvent("down"));
  leftEl.addEventListener("click", () => moveEvent("left"));
  rightEl.addEventListener("click", () => moveEvent("right"));

  // e stands for event
  document.addEventListener("keypress", (e) => {
    // TODO: May want to debounce?
    const keyName = e.key;
    const validKeys = ["w", "a", "s", "d"];
    if(validKeys.find((el) => {
      return el === keyName;
    })) {
      moveEvent(keyName, 1);
    }
  });
}



createOverlay();
setMoveEvents();
