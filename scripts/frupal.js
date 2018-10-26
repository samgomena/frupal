import Person from "./person";
import Display from "./display";

let Hero = new Person("Ben", {x:0,y:0}, 100, 100); 
let HUD = new Display(Hero);

// FIXME: Find a place to put the dead status check.
// FIXME: We can probably sweep this elsewhere.
function goUp() {
  Hero.goUp();
  Hero.consumeEnergy(1);
  HUD.update();
}

function goDown() {
  Hero.goDown();
  Hero.consumeEnergy(1);
  HUD.update();
}

function goLeft() {
  Hero.goLeft();
  Hero.consumeEnergy(1);
  HUD.update();
}

function goRight() {
  Hero.goRight();
  Hero.consumeEnergy(1);
  HUD.update();
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