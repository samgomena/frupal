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
14, 12, 0, 2, None`;

const TERRAIN_MAP = {
    0: {
        name: "MEADOW",
        cost: 1,
        color: "#32CD32",
    },
    1: {
        name: "FOREST",
        cost: 1,
        color: "#0c854e",
    },
    2: {
        name: "WATER",
        cost: 1,
        color: "#218aff",
    },
    3: {
        name: "WALL",
        cost: 1,
        color: "#a7a0a5",
    },
    4: {
        name: "BOG",
        cost: 2,
        color: "#5b4a4d",
    },
    5: {
        name: "SWAMP",
        cost: 2,
        color: "#475b41",
    },
};

const NUM_REGEX = /(\d+)/;
const COORD_REGEX = /(\d+),\s*(\d+)/;
const MAP_ITEM_REGEX = /(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*([\w\s]+)/;

/**
 *
 * This function expects `game_config` to be in the following format:
 *
 *  A Game Title        - The games title
 *  5                   - The width and height of the game board
 *  ########            - An opening delimiter
 *  1, 1                - The starting location of the player
 *  10                  - The starting energy of the player
 *  100                 - The starting money of the player
 *  Item 1              - An item the player starts with
 *  Item 2              - Can be any string; case sensitive; duplicates allowed
 *  ########            - A closing delimiter; characters must match starting delimiter
 *  1,1,1,1,Obstacle 1  - An obstacle/item placed on the map in the form x,y,visibility,terrain id,name;
 *  2,2,0,1,Obstacle 2  - All values must be present; spaces are allowed and at least one must be 'Royal Diamonds'
 *  3, 3, 0, 1, Royal Diamonds
 *
 *
 * @param game_config A map 'file' to parse
 * @returns Object An object containing the parsed data
 */
function parse(game_config) {
    const GAME = {};
    GAME.map = {};
    GAME.map.layers = [];
    GAME.map.objects = [];
    GAME.player = {};
    GAME.player.tools = {};

    let split_map_file = game_config.split("\n");

    // Unpack and truncate first three items
    let [game_title, board_size, first_delimiter] = split_map_file.splice(0, 3);

    GAME.title = game_title;
    GAME.map.width = GAME.map.height = +board_size;
    // Control layer
    GAME.map.layers.push(new Array(+board_size * +board_size));

    let delimiter = first_delimiter.charAt(0);

    // Dynamically create regex to parse delimiter i.e. /#+/ if # is delimiter
    let delimiter_regex = new RegExp(`${delimiter}+`);

    // Destruct regex match groups into x, y coordinate variables
    let [, hero_start_x, hero_start_y] = split_map_file.splice(0, 1)[0].match(COORD_REGEX);
    GAME.player.pos = {
        x: +hero_start_x,
        y: +hero_start_y,
    };

    let [, hero_energy] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
    GAME.player.energy = +hero_energy;

    let [, hero_whiffles] = split_map_file.splice(0, 1)[0].match(NUM_REGEX);
    GAME.player.whiffles = +hero_whiffles;

    // Loop until we see the delimiter again
    while (!split_map_file[0].match(delimiter_regex)) {
        let player_item = split_map_file.splice(0, 1)[0];
        // Update player's tool object with tool count
        GAME.player.tools.hasOwnProperty(player_item) ? GAME.player.tools[player_item]++ : GAME.player.tools[player_item] = 1;
    }

    // Remove closing delimiter
    split_map_file.splice(0, 1);

    // Loop through map items after the delimiter
    split_map_file.forEach(map_item => {

        if(!MAP_ITEM_REGEX.test(map_item)) {
            throw Error(`'${map_item}' is not a valid syntax for a map items`)
        }

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

    // Populate map layer with map objects
    let obstacle_layer = new Array(+board_size * +board_size);
    GAME.map.objects.forEach(map_object => {
        obstacle_layer[map_object.x * map_object.y] = map_object;
    });
    GAME.map.layers.push(obstacle_layer);


    // Perform checks

    // Throw if player's starting location is off the map
    if(GAME.player.pos.x > GAME.map.width || GAME.player.pos.y > GAME.map.height) {
        throw Error(`Starting position of (${GAME.player.pos.x}, ${GAME.player.pos.y}) is out of bounds.`);
    }

    let contains_diamonds = Boolean(GAME.map.objects.filter(board_object => {
        return board_object.name === "Royal Diamonds";
    }).length);

    // Throw if no diamonds
    if(!contains_diamonds) {
        throw Error(`The map does not contain the royal diamonds.`);
    }

    return GAME;
}

console.log(parse(map_file));