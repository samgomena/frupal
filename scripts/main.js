import Person from "./person";
import Display from "./display";
import { parse, DEFAULT_CONFIG } from "./parseConfig";
import Game from "./game";
import { setGameData } from "./setGameData";
import createOverlay from "./overlay";
import Map from "./map";
import "../styles/main.scss";
// Don't move this, Overlay must be created before Map and before update event listener.
createOverlay();

// Parse the game config
let map;
let gameConfig = parse(DEFAULT_CONFIG);
let gameData = setGameData(gameConfig);

// console.log("MAP:", map);
let hero_init = gameConfig.player;

// Sets text in the browser tab
setTitle(gameConfig.title);

// This triggers map refresh, has to come after call to overlay above.
let update = document.getElementById("update");

update.addEventListener("click", function() {
  if(!localStorage.hasOwnProperty("currentMap")){
    throw new Error("No current map");
  }

  let paramsList = localStorage.currentMap;
  paramsList = JSON.parse(paramsList);
  let updatedGame = setGameData(paramsList);
  map = updatedGame.map;
  console.log(map);
  hero_init = updatedGame.player;
  // ...
  // Whoever is working on the map, connect the array of parameters (paramList)
  // to the DEFAULT_PARAM thing so that a new map can be generated upon pressing
  // the start button. 
  // ...
});

/*
let start = document.getElementById("start");
start.addEventListener("click", () => {
  // Grab the canvas element
  let context = document.getElementById("demo");
  let hero = new Person(hero_init, map);
  let display = new Display(hero, map);

  let game = new Game(context, map, hero, display);
  game.run();
});
*/

let context = document.getElementById("demo");
let hero = new Person(hero_init, map);
let display = new Display(hero, map);

let game = new Game(context, map, hero, display);
game.run();


/**
 * This function sets the windows title element to `title`
 * @param title Text to set the window title to
 */
function setTitle(title) {
  document.getElementById("game-title").innerHTML = title;
}
