import Person from "./person";
import Display from "./display";
import parse_config from "./parse_config";
import Game from "./game"
import "../styles/main.scss";

// Parse the game config
let game_config = parse_config.parse(parse_config.default_config);

// TODO: Use map class instead of raw config
let map = game_config.map;
let hero_init = game_config.player;

// Sets text in the browser tab
setTitle(game_config.title);

// Grab the canvas element
let context = document.getElementById('demo');
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




