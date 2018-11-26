
let assert = require("assert");
let TERRAIN_MAP = require("../scripts/data/terrainMap").TERRAIN_MAP;
let config = require("../scripts/parseConfig");
import Map from "../scripts/map";

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomChoice(possibilities) {
  let max = possibilities.length;
  return possibilities[getRandomArbitrary(0, max)];
}

function defineConfig(map_size, delim, starting_location, energy, money, item) {
  return `Sample Frupal Game Map
    ${map_size}
    ${delim}
    ${starting_location},${starting_location}
    ${energy}
    ${money}
    ${delim}
    ${getRandomArbitrary(0, starting_location)}, ${getRandomArbitrary(0, starting_location)}, 0, 4, Royal Diamonds`;
  // ${item}`;
}

describe("Verify `parse`", function() {
  let map_size, delim, starting_location, energy, money, item;

  let game_config;

  beforeEach("Before", function () {
    map_size = getRandomArbitrary(0, 50);
    delim = getRandomChoice("!@#$%^&*-_=+<>/?|`~");
    starting_location = getRandomArbitrary(0, map_size);
    energy = getRandomArbitrary(0, 1000);
    money = getRandomArbitrary(0, 1000);

    game_config = defineConfig(map_size, delim, starting_location, energy, money);
  });

  it("Verify terrain constants", function (done) {

    Object.values(TERRAIN_MAP).forEach(tile => {
      console.log(tile);
      ["name", "cost", "color", "canEnter"].forEach(tile_key => {
        assert(tile.hasOwnProperty(tile_key), `${tile} needs to have ${tile_key}`);
      });
    });
    done();
  });

  it("Verify `parse` functionality", function(done) {
    // Neither of these should throw
    let parse_data = config.parse(game_config);
    let map = parse_data.map;

    assert.strictEqual(parse_data.board_size, map_size);
    assert.deepStrictEqual([parse_data.map.width, parse_data.map.height], [map_size, map_size]);
    assert(map.tiles instanceof Array);

    done();
  });
});