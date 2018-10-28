import Person from "./person";
import Display from "./display";
import { Map, DEFAULT_PARAMS } from "./map";

let Hero = new Person("Ben", {x:0,y:0}, 100, 100); 
let HUD = new Display(Hero);
let map = new Map(DEFAULT_PARAMS);

// FIXME: Find a place to put the dead status check.
// FIXME: We can probably sweep this elsewhere.
/*
 FIXME: Not sure if map should keep track of player movement, or if the
 player should update the map in regards to its position.
*/
function goUp() {
  Hero.goUp();
  Hero.consumeEnergy(1);
  
  if(HUD.update())
    return true;
  else
    return false;  // end game
}

function goDown() {
  Hero.goDown();
  Hero.consumeEnergy(1);
 
  if(HUD.update())
    return true;
  else
    return false;  // end game
}

function goLeft() {
  Hero.goLeft();
  Hero.consumeEnergy(1);

  if(HUD.update())
    return true;
  else
    return false;  // end game

}

function goRight() {
  Hero.goRight();
  Hero.consumeEnergy(1);

  if(HUD.update())
    return true;
  else
    return false;  // end game

}

function setMoveEvents() {
  // FIXME: A bit clunky, but whatever.
  let upEl = document.getElementById("up");
  let downEl = document.getElementById("down");
  let leftEl = document.getElementById("left");
  let rightEl = document.getElementById("right");

  upEl.addEventListener("click", () => goUp());
  downEl.addEventListener("click", () => goDown());
  leftEl.addEventListener("click", () => goLeft());
  rightEl.addEventListener("click", () => goRight());
}

setMoveEvents();
