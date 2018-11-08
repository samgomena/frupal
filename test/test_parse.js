
let assert = require('assert');
let config = require('../scripts/parse_config');

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
        delim = getRandomChoice(['!@#$%^&*-_=+<>/?|`~']);
        starting_location = getRandomArbitrary(0, map_size);
        energy = getRandomArbitrary(0, 1000);
        money = getRandomArbitrary(0, 1000);

        game_config = defineConfig(map_size, delim, starting_location, energy, money);
    });

    it("Test `parse` functionality", function(done) {
        // Neither of these should throw an error
        let parse_data = config.parse(game_config);
        let game_data = config.setGameData(parse_data);

        assert.strictEqual(parse_data.board_size, map_size);
        assert.deepStrictEqual([parse_data.map.width, parse_data.map.height], [map_size, map_size]);
        assert(parse_data.map.layers instanceof Array);
        assert(parse_data.player.pos instanceof Object);

        done();
    })
});