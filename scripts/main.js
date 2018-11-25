import Person from "./person";
import Display from "./display";
import { parse, DEFAULT_CONFIG } from "./parseConfig";
import Game from "./game";
import createOverlay from "./overlay";
import "../styles/main.scss";
// Don't move this, Overlay must be created before Map and before update event listener.
createOverlay();

// Parse the game config
let gameConfig = parse(DEFAULT_CONFIG);
//let gameData = setGameData(gameConfig);

let map = gameConfig.map;
// console.log("MAP:", map);
let hero_init = gameConfig.player;

// Sets text in the browser tab
setTitle(gameConfig.title);

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
