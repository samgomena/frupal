"use strict";
import Map from "./map";

let TERRAIN_MAP = require("./data/terrainMap").TERRAIN_MAP;
const items = require("./data/items");

const NUM_REGEX = /(\d+)/;
const COORD_REGEX = /(\d+),\s*(\d+)/;

const DEFAULT_CONFIG =
`Sample Frupal Game Map
25
#####################
12,12
50
1000
Shears
Pretty Rock
#####################
3, 4, 0, 1, None
3, 5, 0, 1, None
3, 6, 0, 1, None
3, 7, 0, 1, None
4, 4, 0, 1, None
4, 5, 0, 1, None
4, 6, 0, 1, ${items.TREE.name}
4, 7, 0, 1, None
5, 4, 0, 1, None
5, 5, 0, 1, None
5, 6, 0, 1, None
5, 7, 0, 1, None
6, 4, 0, 1, None
6, 5, 0, 1, None
6, 6, 0, 1, None
6, 7, 0, 1, None
8, 17, 0, 0, ${items.CHISEL.name}
9, 1, 0, 0, ${items.CHAINSAW.name}
9, 9, 0, 0, ${items.TREASURE.name}
10, 10, 0, 0, ${items.TREASURE.name}
10, 11, 0, 0, ${items.TYPE_TWO.name}
10, 15, 0, 0, ${items.BOULDER.name}
10, 16, 0, 2, None
10, 17, 0, 2, None
10, 18, 0, 2, None
10, 19, 0, 2, None
10, 20, 0, 0, ${items.BLK_BERRY.name}
11, 11, 0, 1, ${items.BINOCULARS.name}
11, 14, 0, 2, None
11, 15, 0, 2, None
11, 16, 0, 2, None
11, 19, 0, 2, None
12, 14, 0, 2, None
12, 19, 0, 2, None
12, 20, 0, 2, None
13, 7, 0, 0, ${items.WEED_WHACKER.name}
13, 13, 0, 2, None
13, 14, 0, 2, None
13, 20, 0, 2, None
13, 21, 0, 2, None
13, 22, 0, 2, None
13, 23, 0, 2, None
14, 13, 0, 2, None
14, 23, 0, 2, None
14, 24, 0, 2, None
14, 25, 0, 2, None
15, 5, 0, 0, ${items.POWER_BAR.name}
15, 12, 0, 2, None
15, 13, 0, 2, None
15, 15, 0, 6, ${items.ROYAL_DIAMONDS.name}
15, 16, 0, 4, None
16, 12, 0, 2, None
17, 10, 0, 0, ${items.BOAT.name}
17, 12, 0, 2, None
18, 11, 0, 2, None
18, 12, 0, 2, None
19, 9, 0, 0, ${items.SHEARS.name}
19, 11, 0, 2, None
20, 11, 0, 2, None
21, 1, 0, 0, ${items.AXE.name}
21, 7, 0, 0, ${items.HATCHET.name}
21, 10, 0, 2, None
21, 11, 0, 2, None
21, 12, 0, 2, None
22, 9, 0, 2, None
22, 10, 0, 2, None
22, 11, 0, 2, None
22, 12, 0, 2, None
22, 13, 0, 2, None
23, 3, 0, 0, ${items.JACKHAMMER.name}`;
23, 8, 0, 2, None
23, 9, 0, 2, None
23, 10, 0, 2, None
23, 11, 0, 2, None
23, 12, 0, 2, None
23, 13, 0, 2, None
23, 14, 0, 2, None
24, 1, 0, 0, ${items.SLEDGE.name}
24, 8, 0, 2, None
24, 9, 0, 2, None
24, 10, 0, 2, None
24, 11, 0, 2, None
24, 12, 0, 2, None
24, 13, 0, 2, None
25, 9, 0, 2, None
25, 10, 0, 2, None
25, 11, 0, 2, None
25, 12, 0, 2, None

// x,y,visibility,terrain id,name;
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
  GAME.player = {};
  GAME.player.items = {};

  GAME.player.inventory = [];

  let split_map_file = game_config.split("\n");

  // Unpack and truncate first three items
  let [game_title, board_size, first_delimiter] = split_map_file.splice(0, 3);

  GAME.title = game_title;
  GAME.map = new Map(+board_size, +board_size);
  GAME.board_size = +board_size;

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

    GAME.player.inventory.push(player_item);
  }

  // Remove closing delimiter
  split_map_file.splice(0, 1);
  GAME.split_map_file = split_map_file;

  GAME.map.initObjects(split_map_file);

  return GAME;
}

module.exports = {
  DEFAULT_CONFIG: DEFAULT_CONFIG,
  parse: parse
};
