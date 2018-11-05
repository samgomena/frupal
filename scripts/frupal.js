import Person from "./person";
import Display from "./display";
import parse_config from "./parse_config";
import Game from "./game";
import createOverlay from "./overlay";
import { Map, DEFAULT_PARAMS } from "./map";
import "../styles/main.scss";
// Don't move this, Overlay must be created before Map and before update event listener.
createOverlay();

// Parse the game config
let game_config = parse_config.parse(parse_config.default_config);

// TODO: Use map class instead of raw config
let map = game_config.map;
let hero_init = game_config.player;

// Sets text in the browser tab
setTitle(game_config.title);
// This triggers map refresh, has to come after call to overlay above.
let update = document.getElementById("update");
update.addEventListener("click", function() {
  console.log("TEST");
  if(!localStorage.key("currentMap"))
    return;
  let paramList = Array.from(JSON.parse(localStorage.getItem("currentMap")));
  for(let i = 0; i < paramList.length; ++i){ // For the person linking paramList and DEFAULT_PARAMS up.
    console.log(i + ": " + paramList[i]);
  }
  // ...
  // Whoever is working on the map, connect the array of parameters (paramList)
  // to the DEFAULT_PARAM thing so that a new map can be generated upon pressing
  // the start button. 
  // ...
  map = new Map(DEFAULT_PARAMS); // Reset
});

// Grab the canvas element
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