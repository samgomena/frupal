const map_file =
`Sample Frupal Game Map
25
#####################
12,12
103
1000
Axe
Axe
Shears
Pretty Rock
#####################
12,12,1,1,None
13,12,0,1,Tree
14,12,0,2,None`;

const TERRAIN_MAP = {
    0: "MEADOW",
    1: "FOREST",
    2: "WATER",
    3: "WALL",
    4: "BOG",
    5: "SWAMP",
};

const NUM_REGEX = /(\d+)/;
const COORD_REGEX = /(\d+),\s*(\d+)/;
const MAP_ITEM_REGEX = /(\d+),\s*(\d+),(\d+),(\d+),(\w+)/;

export function parse(game_config) {
    const GAME = {};
    GAME.map = {};
    GAME.hero = {};
    GAME.hero.position = {};
    GAME.map.map_objects = [];

    let split_map_file = game_config.split("\n");

    // Unpack and truncate first three items
    let [game_title, board_size, first_delimiter] = split_map_file.splice(0, 3);

    GAME.title = game_title;
    GAME.map.size = {
        width: board_size,
        height: board_size,
    };

    let delimiter = first_delimiter.charAt(0);

    // Dynamically create regex to parse delimiter i.e. /#+/ if # is delimiter
    let delimiter_regex = new RegExp(`${delimiter}+`);

    // Destruct regex match groups into x, y coordinate variables
    let [, hero_start_x, hero_start_y] = split_map_file.splice(0, 1)[0].match(COORD_REGEX);
    GAME.hero.x = hero_start_x;
    GAME.hero.y = hero_start_y;

    let [, hero_energy] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
    GAME.hero.energy = hero_energy;

    let [, hero_whiffles] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
    GAME.hero.whiffles = hero_whiffles;

    // GAME.hero.tools = new Proxy({}, {get: (target, name) => (++target[name] || 1)});

    GAME.hero.tools = {};

    // Loop until we see the delimiter again
    while (!split_map_file[0].match(delimiter_regex)) {
        let hero_item = split_map_file.splice(0, 1)[0];
        // Update hero's tool object with tool count
        GAME.hero.tools.hasOwnProperty(hero_item) ? GAME.hero.tools[hero_item]++ : GAME.hero.tools[hero_item] = 1;
    }

    // Remove closing delimiter
    split_map_file.splice(0, 1);



    // Loop through everything after the delimiter
    split_map_file.forEach(map_item => {

        let [, x, y, visibility, terrain, name] = map_item.match(MAP_ITEM_REGEX) || [];

        if (x > board_size || y > board_size) {
            throw Error(`ERROR: [${x}, ${y}] out of range [${board_size}, ${board_size}].`);
        } else if (!TERRAIN_MAP[terrain]) {
            throw Error(`ERROR: ${terrain} is not a valid terrain value.`)
        }

        GAME.map_objects.push({
            x: parseInt(x),
            y: parseInt(y),
            visible: Boolean(parseInt(visibility)),
            terrain: TERRAIN_MAP[terrain],
            name: name === 'None' ? "" : name,
        });
    });

    console.log(GAME.map_objects);
    console.log(game_title, board_size);

    let contains_diamonds = Boolean(GAME.map_objects.filter(board_object => {
        return board_object.name === "Royal Diamonds"
    }).length);
    console.log(contains_diamonds);

    return GAME;
}