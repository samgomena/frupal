
let assert = require("assert");
let TERRAIN_MAP = require("../scripts/data/terrainMap").TERRAIN_MAP;
import * as ITEMS from "../scripts/data/items"


for (let item in ITEMS) {
    console.log(`${item}: ${ITEMS[item].name} - ${item.toString().toLowerCase()}`);
}

describe("Verify Constants Exist", function() {

    it("Verify terrain constants exist", function (done) {

        Object.values(TERRAIN_MAP).forEach(tile => {
            ["name", "cost", "color", "canEnter"].forEach(tile_key => {
                assert(tile.hasOwnProperty(tile_key), `${tile} needs to have ${tile_key}`);
            });
        });
        done();
    });

    it("Verify item constants exist", function(done) {
        for (let item in ITEMS) {
            console.log(`${ITEMS[item].name} - ${item.toString().charAt(0).toUpperCase() + item.substring(1).replace(/_/g, " ").toLowerCase()}`);
            assert(
                ITEMS[item].name.toLowerCase() === item.toString().replace(/_/g, " ").toLowerCase(),
                `${item} does not match ${ITEMS[item]}`
                )
        }

        done();
    })

});