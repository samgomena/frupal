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
1000
1000
${items.PRETTY_ROCK.name}
#####################
1, 2, 0, 0, ${items.AXE.name}
2, 3, 0, 1, None
2, 4, 0, 1, None
2, 5, 0, 1, None
2, 24, 0, 0, ${items.BOULDER.name}
3, 3, 0, 1, None
3, 4, 0, 1, None
3, 5, 0, 1, None
3, 6, 0, 1, None
3, 7, 0, 1, None
3, 10, 0, 0, ${items.HATCHET.name}
3, 22, 0, 0, ${items.BOULDER.name}
4, 3, 0, 1, None
4, 4, 0, 1, None
4, 5, 0, 1, None
4, 6, 0, 1, ${items.TREE.name}
4, 7, 0, 1, None
4, 8, 0, 1, None
4, 16, 0, 0, ${items.TYPE_TWO.name}
4, 24, 0, 0, ${items.JACKHAMMER.name}
5, 4, 0, 1, None
5, 5, 0, 1, None
5, 6, 0, 1, None
5, 7, 0, 1, None
5, 8, 0, 1, None
5, 19, 0, 0, ${items.POWER_BAR.name}
5, 22, 0, 2, None
5, 23, 0, 2, None
6, 4, 0, 1, ${items.TREE.name}
6, 5, 0, 1, None
6, 6, 0, 1, None
6, 7, 0, 1, None
6, 8, 0, 1, None
6, 22, 0, 2, None
6, 23, 0, 2, None
6, 24, 0, 2, None
7, 4, 0, 2, None
7, 5, 0, 2, None
7, 6, 0, 1, None
7, 7, 0, 1, None
7, 23, 0, 0, ${items.BOULDER.name}
8, 4, 0, 2, None
8, 5, 0, 2, None
8, 6, 0, 2, None
8, 7, 0, 1, None
8, 14, 0, 0, ${items.SLEDGE.name}
8, 16, 0, 4, ${items.BOULDER.name}
8, 17, 0, 4, None
8, 19, 0, 0, ${items.CHISEL.name}
9, 1, 0, 0, ${items.CHAINSAW.name}
9, 2, 0, 0, ${items.CHAINSAW.name}
9, 5, 0, 2, None
9, 6, 0, 2, None
9, 9, 0, 0, ${items.TREASURE.name}
9, 16, 0, 4, None
9, 17, 0, 4, None
9, 18, 0, 4, ${items.BOULDER.name}
9, 19, 0, 4, None
10, 5, 0, 2, None
10, 6, 0, 2, None
10, 14, 0, 4, None
10, 15, 0, 4, ${items.BOULDER.name}
10, 16, 0, 2, None
10, 17, 0, 2, None
10, 18, 0, 2, None
10, 19, 0, 2, None
10, 20, 0, 0, ${items.BLK_BERRY.name}
10, 25, 0, 0, ${items.SHEARS.name}
11, 10, 0, 0, ${items.BINOCULARS.name}
11, 13, 0, 4, ${items.BOULDER.name}
11, 14, 0, 2, None
11, 15, 0, 2, None
11, 16, 0, 2, None
11, 17, 0, 0, ${items.BOULDER.name}
11, 19, 0, 2, None
11, 20, 0, 0, ${items.BLK_BERRY.name}
12, 13, 0, 4, None
12, 14, 0, 2, None
12, 19, 0, 2, None
12, 20, 0, 2, None
12, 21, 0, 0, ${items.BLK_BERRY.name}
12, 22, 0, 0, ${items.BLK_BERRY.name}
12, 23, 0, 0, ${items.BLK_BERRY.name}
13, 3, 0, 0, ${items.JACKHAMMER.name}
13, 7, 0, 0, ${items.WEED_WHACKER.name}
13, 13, 0, 2, None
13, 14, 0, 2, None
13, 19, 0, 4, ${items.BOULDER.name}
13, 20, 0, 2, None
13, 21, 0, 2, None
13, 22, 0, 2, None
13, 23, 0, 2, None
14, 13, 0, 2, None
14, 14, 0, 0, ${items.BLK_BERRY.name}
14, 19, 0, 4, None
14, 20, 0, 4, None
14, 21, 0, 4, ${items.BOULDER.name}
14, 22, 0, 4, ${items.BOULDER.name}
14, 23, 0, 2, None
14, 24, 0, 2, None
14, 25, 0, 2, None
15, 5, 0, 0, ${items.POWER_BAR.name}
15, 12, 0, 2, None
15, 13, 0, 2, None
15, 14, 0, 0, ${items.BLK_BERRY.name}
15, 17, 0, 0, ${items.TREASURE.name}
15, 22, 0, 4, None
15, 23, 0, 4, None
16, 12, 0, 2, None
16, 13, 0, 0, ${items.BLK_BERRY.name}
16, 19, 0, 1, None
16, 20, 0, 1, None
17, 12, 0, 2, None
17, 15, 0, 0, ${items.CHAINSAW.name}
17, 19, 0, 1, ${items.TREE.name}
17, 20, 0, 1, None
17, 21, 0, 1, None
18, 7, 0, 0, ${items.TYPE_TWO.name}
18, 11, 0, 2, None
18, 12, 0, 2, None
18, 13, 0, 4, None
18, 18, 0, 1, None
18, 19, 0, 1, None
18, 20, 0, 1, None
18, 24, 0, 0, ${items.CHISEL.name}
19, 9, 0, 0, ${items.SHEARS.name}
19, 11, 0, 2, None
19, 12, 0, 4, ${items.BOULDER.name}
19, 13, 0, 4, None
19, 18, 0, 1, None
19, 19, 0, 2, None
19, 20, 0, 2, None
19, 21, 0, 2, None
20, 11, 0, 2, None
20, 12, 0, 4, ${items.BOULDER.name}
20, 14, 0, 0, ${items.POWER_BAR.name}
20, 19, 0, 2, None
20, 20, 0, 2, None
20, 21, 0, 2, None
21, 1, 0, 0, ${items.AXE.name}
21, 7, 0, 0, ${items.HATCHET.name}
21, 10, 0, 2, None
21, 11, 0, 2, None
21, 12, 0, 2, None
21, 19, 0, 6, ${items.ROYAL_DIAMONDS.name}
21, 20, 0, 2, None
21, 21, 0, 2, None
22, 5, 0, 0, ${items.TREASURE.name}
22, 8, 0, 0, ${items.BOAT.name}
22, 9, 0, 2, None
22, 10, 0, 2, None
22, 11, 0, 2, None
22, 12, 0, 2, None
22, 13, 0, 2, None
22, 17, 0, 0, ${items.TYPE_TWO.name}
22, 20, 0, 2, None
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
24, 21, 0, 0, ${items.WEED_WHACKER.name}
25, 9, 0, 2, None
25, 10, 0, 2, None
25, 11, 0, 2, None
25, 12, 0, 2, None`;

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
    // THE STUPID PRETTY ROCK IS BREAKING EVERYTHING SO THIS FIXES THE STUPID ROCK
    const arr_items = Object.keys(items).map(key => items[key]);
    GAME.player.inventory.push(arr_items.find((obj) => player_item === obj.name));
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
