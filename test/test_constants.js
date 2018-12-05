import fs from "fs";

let assert = require("assert");
let TERRAIN_MAP = require("../scripts/data/terrainMap").TERRAIN_MAP;
import * as ITEMS from "../scripts/data/items"


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
            // console.log(`${ITEMS[item].name} - ${item.toString().charAt(0).toUpperCase() + item.substring(1).replace(/_/g, " ").toLowerCase()}`);
            assert(
                ITEMS[item].name.toLowerCase() === item.toString().replace(/_/g, " ").toLowerCase(),
                `${item} does not match ${ITEMS[item]}`
                )
        }

        done();
    });

    it("Verify assets directory exists", function(done) {

        assert(fs.existsSync(`${__dirname}/../assets`));
        assert(fs.existsSync(`${__dirname}/../assets/items`));

        done();
    });

    it("Verify PNG assets exists", async function(done) {
        let required_assets = ["balloons", "charsets_12_characters_4thsheet_completed_by_antifarea", "player", "roguelikeSheet_transparent"];
        let required_items = ["bar", "binoculars", "boat", "chainsaw", "diamond", "treasure"];
        // fs.existsSync()

        required_assets.forEach(asset => {
            assert(fs.existsSync(`${__dirname}/../assets/${asset}.png`));
        });

        required_items.forEach(item => {
            assert(fs.existsSync(`${__dirname}/../assets/items/${item}.png`));
        });

        done();
    })

});