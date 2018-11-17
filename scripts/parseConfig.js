"use strict";

let TERRAIN_MAP = require("./terrainMap").TERRAIN_MAP;


const NUM_REGEX = /(\d+)/;
const COORD_REGEX = /(\d+),\s*(\d+)/;
const MAP_ITEM_REGEX = /(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*([\w\s]+)/;

const DEFAULT_CONFIG =
`Sample Frupal Game Map
25
#####################
12,12
100
1000
Axe
Axe
Shears
Boat
Pretty Rock
#####################
12, 12, 1, 1, None
13, 12, 0, 1, Tree
15, 13, 0, 6, Royal Diamonds
11, 11, 0, 0, Binoculars
15, 16, 0, 4, Bog 
14, 12, 0, 2, None`;


/**
 *
 * This function expects `game_config` to be in the following format:
 *
 *  A Game Title                - The games title
 *  5                           - The width and height of the game board
 *  ########                    - An opening delimiter
 *  1, 1                        - The starting location of the player
 *  10                          - The starting energy of the player
 *  100                         - The starting money of the player
 *  Item 1                      - An item the player starts with
 *  Item 2                      - Can be any string; case sensitive; duplicates allowed
 *  ########                    - A closing delimiter; characters must match starting delimiter
 *  1,1,1,1,Obstacle 1          - An obstacle/item placed on the map in the form x,y,visibility,terrain id,name;
 *  2,2,0,1,Obstacle 2          - All values must be present; spaces are allowed
 *  3, 3, 0, 1, Royal Diamonds  - At least one item must be 'Royal Diamonds'
 *
 * This will throw an error if it encounters an incorrectly formatted game config.
 *
 * @param game_config A map 'file' to parse
 * @returns Object An object containing the parsed data
 */
function parse(game_config) {
  const GAME = {};
  GAME.map = {};
  GAME.map.tile_size = 64; // Magic for now
  GAME.map.objects = [];
  GAME.player = {};
  GAME.player.items = {};

  let split_map_file = game_config.split("\n");

  // Unpack and truncate first three items
  let [game_title, board_size, first_delimiter] = split_map_file.splice(0, 3);

  GAME.board_size = +board_size;

  GAME.title = game_title;
  GAME.map.width = GAME.map.height = +board_size;
  // Control layer
  GAME.map.layers = new Array(GAME.map.width * GAME.map.width);

  let delimiter = first_delimiter.charAt(0);

  // Dynamically create regex to parse delimiter i.e. /#+/ if # is delimiter
  let delimiter_regex = new RegExp(`${delimiter}+`);

  // Destruct regex match groups into x, y coordinate variables
  //Subtract 1 to convert into "true" coordinates
  let [, hero_start_x, hero_start_y] = split_map_file.splice(0, 1)[0].match(COORD_REGEX);
  GAME.player.pos = {
    x: ((+hero_start_x) - 1),
    y: ((+hero_start_y) - 1)
  };

  let [, hero_energy] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
  GAME.player.energy = +hero_energy;

  let [, hero_whiffles] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
  GAME.player.whiffles = +hero_whiffles;

  // Loop until we see the delimiter again
  while (!split_map_file[0].match(delimiter_regex)) {
    let player_item = split_map_file.splice(0, 1)[0];
    // Update player's tool object with tool count
    GAME.player.items.hasOwnProperty(player_item) ? GAME.player.items[player_item]++ : GAME.player.items[player_item] = 1;
  }

  // Remove closing delimiter
  split_map_file.splice(0, 1);

  // Loop through map items after the delimiter
  split_map_file.forEach(map_item => {

    if(!MAP_ITEM_REGEX.test(map_item)) {
      throw Error(`'${map_item}' is not a valid syntax for a map items`);
    }

    let [, x, y, visibility, terrain, name] = map_item.match(MAP_ITEM_REGEX) || [];

    if (+x > board_size || +y > board_size) {
      throw Error(`Position of ${name} at (${x}, ${y}) is out of bounds.`);
    }

    if (!TERRAIN_MAP[terrain]) {
      throw Error(`${TERRAIN_MAP[terrain]} is not a valid terrain value.`);
    }

    GAME.map.objects.push({
      x: ((+x) - 1),
      y: ((+y) - 1),
      visible: Boolean(+visibility),
      terrain: TERRAIN_MAP[terrain],
      name: name === "None" ? "" : name
    });
  });

  return GAME;
}

function setGameData(gameData) {

  let obstacle_layer = new Array((gameData.board_size) * (gameData.board_size));

  for (let i = 0; i < obstacle_layer.length; ++i)
  {
    obstacle_layer[i] = {
      x: undefined,
      y: undefined,
      visible: false,
      terrain: TERRAIN_MAP[0],
      name: ""
    };
  }

  for(let i = 0; i < gameData.map.objects.length; ++i) {
    let index = (gameData.map.objects[i].x * gameData.map.width) + gameData.map.objects[i].y;
    obstacle_layer[index] = gameData.map.objects[i];
  }
  gameData.map.layers = obstacle_layer;


  // Perform checks

  // TODO: Add error checking to ensure jewels aren't at player starting location

  // Throw if player's starting location is off the map
  if(gameData.player.pos.x > gameData.map.width || gameData.player.pos.y > gameData.map.height) {
    throw Error(`Starting position of (${gameData.player.pos.x}, ${gameData.player.pos.y}) is out of bounds.`);
  }

  let contains_diamonds = gameData.map.objects.filter(board_object => {
    return board_object.name === "Royal Diamonds";
  }).length;

  // Throw if more than 1 diamonds
  if(contains_diamonds !== 1) {
    throw Error("The map can only have one royal diamonds item.");
  }

  // Throw if no diamonds
  if(!contains_diamonds) {
    throw Error("The map does not contain the royal diamonds.");
  }
  // console.log("GAME DATA ", gameData);
  return gameData;
}

module.exports = {
  TERRAIN_MAP: TERRAIN_MAP,
  DEFAULT_CONFIG: DEFAULT_CONFIG,
  parse: parse,
  setGameData: setGameData
};
