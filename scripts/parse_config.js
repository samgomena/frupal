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
15,13,0,4,Royal Diamonds
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
const MAP_ITEM_REGEX = /(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*([\w\s]+)/;

function parse(game_config) {
    const GAME = {};
    GAME.map = {};
    GAME.map.objects = [];
    GAME.hero = {};
    GAME.hero.tools = {};

    let split_map_file = game_config.split("\n");

    // Unpack and truncate first three items
    let [game_title, board_size, first_delimiter] = split_map_file.splice(0, 3);

    GAME.title = game_title;
    GAME.map.width = GAME.map.height = +board_size;

    let delimiter = first_delimiter.charAt(0);

    // Dynamically create regex to parse delimiter i.e. /#+/ if # is delimiter
    let delimiter_regex = new RegExp(`${delimiter}+`);

    // Destruct regex match groups into x, y coordinate variables
    let [, hero_start_x, hero_start_y] = split_map_file.splice(0, 1)[0].match(COORD_REGEX);
    GAME.hero.pos = {
        x: +hero_start_x,
        y: +hero_start_y,
    };

    let [, hero_energy] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
    GAME.hero.energy = +hero_energy;

    let [, hero_whiffles] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
    GAME.hero.whiffles = +hero_whiffles;

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
            throw Error(`Position of ${name} at (${x}, ${y}) is out of bounds.`);
        }

        if (!TERRAIN_MAP[terrain]) {
            throw Error(`${terrain} is not a valid terrain value.`)
        }

        GAME.map.objects.push({
            x: +x,
            y: +y,
            visible: Boolean(+visibility),
            terrain: TERRAIN_MAP[terrain],
            name: name === 'None' ? "" : name,
        });
    });


    // Perform checks
    if(GAME.hero.pos.x > GAME.map.width || GAME.hero.pos.y > GAME.map.height) {
        throw Error(`Starting position of (${GAME.hero.pos.x}, ${GAME.hero.pos.y}) is out of bounds.`);
    }

    let contains_diamonds = Boolean(GAME.map.objects.filter(board_object => {
        return board_object.name === "Royal Diamonds";
    }).length);

    if(!contains_diamonds) {
        throw Error(`The map does not contain the royal diamonds.`);
    }

    return GAME;
}

console.log(parse(map_file));