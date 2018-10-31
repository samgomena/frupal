import Person from "./person";
import Display from "./display";
import { Map, DEFAULT_PARAMS } from "./map";
import createOverlay from "./overlay";
import "../styles/main.scss";

let Hero = new Person("Ben", {x:0,y:0}, 100, 100); 
let HUD = new Display(Hero);
let map = new Map(DEFAULT_PARAMS);

// TODO: Change the name of this file to something like "main"

// FIXME: Find a place to put the dead status check.
// FIXME: We can probably sweep this elsewhere.
/*
 FIXME: Not sure if map should keep track of player movement, or if the
 player should update the map in regards to its position.
*/

function moveEvent(moveId, energy) {
  switch(moveId) {
  case "up":
  case "w":
    Hero.goUp();
    break;
  case "down":
  case "s":
    Hero.goDown();
    break;
  case "left":
  case "a":
    Hero.goLeft();
    break;
  case "right":
  case "d":
    Hero.goRight();
    break;
  default:
    throw new Error("Not an event!");
  }
  
  // Eventually get energy from a getEnergy function.
  Hero.consumeEnergy(energy);

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
  upEl.addEventListener("click", () => moveEvent("up", 1));
  downEl.addEventListener("click", () => moveEvent("down", 1));
  leftEl.addEventListener("click", () => moveEvent("left", 1));
  rightEl.addEventListener("click", () => moveEvent("right", 1));

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
