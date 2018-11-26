"use strict";
// import Person from "./person";
import {TERRAIN_MAP} from "./data/terrainMap";
import * as items from "./data/items";
const OBJECT_REGEX = /(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*([\w\s]+)/;

/**
 * The Map class controls access to tiles and tile data.
 */
class Map {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tile_size = 16; // Needs to be 16 for graphics.
    this.tiles = new Array(this.width * this.height); 
  }

  /**
   * Called when the player attempts to move. Person no longer has direct access
   * to the map array, so this function is used instead to check for valid
   * traversal of the map.
   * TODO implement mapX,mapY interaction with Person to significantly improve
   *      performance.
   */
  allowMove(x, y, person) {
    let tile = this.getTile(x, y);
    //False for Water and Walls and obstacles.
    if (tile.terrain.canEnter && !tile.object) {
      return {
        allow: true, //allow person to move
        cost: tile.terrain.cost, //cost of movement based on terrain
        object: tile.hasOwnProperty("object") ? tile.object : "None"
      }; //^Either send back the object located on a given tile, or "None"
      // as a default value
    }
    else if (tile.terrain.name === TERRAIN_MAP[2].name && person.boatStatus()) {
      return {
        allow: true,
        cost: 0, //no movement penalty for water+boat
        object: tile.hasOwnProperty("object") ? tile.object : "None"
      };
    }
    else if (tile.object) {
      // If there is an object, allow player to buy it.
      return {
        allow: false,
        cost: tile.terrain.cost,
        object: tile.object
      };
    }
    else {
      return {
        allow: false,
        cost: tile.terrain.cost,//<consume energy if attempting to cross
        object: "None"          // water without a boat
      }; //^no movement -> don't bother sending any items
    }
  }

  /**
   * Called when the player collects an item or destroys an obstacle.
   * Used to delete objects from the map.
   */
  destroyObject(x, y) {
    let tile = this.getTile(x, y);
    // TODO: Maybe just set tile.object to undefined?
    delete tile.object;
    //May need to implement something for graphical updates here...
  }

  /**
   * Returns the terrain type at the location specified by x,y.
   */
  getTerrainName(x, y) {
    return this.getTile(x, y).terrain.name;
  }
  
  /**
   * Returns the terrain movement cost at the location specified by x,y.
   * Movement cost is calculated when moving into a given tile.
   */
  getTerrainCost(x, y) {
    return this.getTile(x, y).terrain.cost;
  }

  /**
   * Returns the object, if there is one, at the location specified by x,y.
   * Returns "None" if no item/obstacle exists at the given location.
   */
  getObjectAtLoc(x, y) {
    let tile = this.getTile(x, y);
    if (tile.hasOwnProperty("object")) //determine if an object lives here
      return tile.object;
    return "None";
  }

  /**
   * Reveals the tile at x,y.
   * TODO refactor to use mapX,mapY to significantly improve performance.
   */
  showTile(x, y) {
    this.getTile(x, y).visible = true;
  }

  /**
   * Fetches the tile at x,y. Performs bounds checking.
   */
  getTile(x, y) {
    if (x < 0) {
      x = this.width - 1;
    }
    if (x >= this.width) {
      x = 0;
    }
    if (y < 0) {
      y = this.height;
    }
    if (y >= this.height) {
      y = 0;
    }
    return this.tiles[(x * this.width) + y];
  }

  /**
   * This is where the map gets populated with objects/terrain.
   * The map is first loaded with the defined objects, followed
   * by the remaining tiles which receive default tile values.
   * The algorithm could be improved, by whatever strategy I could
   * think of still results in redundant iteration.
   */
  initObjects(split_map_file) {
    // Loop through map items after the delimiter
    split_map_file.forEach(map_item => {
      if(!OBJECT_REGEX.test(map_item)) {
        throw Error(`'${map_item}' is not a valid syntax for a map items`);
      }
      let [, x, y, visibility, terrain, object] = map_item.match(OBJECT_REGEX) || [];
      let xC = (+x) - 1;//Subtract one to convert to 'true' coordinates
      let yC = (+y) - 1;//...

      //Checks using true boundaries since xC,yC are unaliased
      if (xC < 0 || xC >= this.width || yC < 0 || yC >= this.height) {
        throw Error(`Position of ${object} at (${x}, ${y}) is out of bounds.`);
      }
      if (!TERRAIN_MAP[terrain]) {
        throw Error(`${TERRAIN_MAP[terrain]} is not a valid terrain value.`);
      }
      let tile;

      if (object === "None") {//The difference here is whether to include an object
        tile = {              //property or not
          visible: Boolean(+visibility),
          terrain: TERRAIN_MAP[terrain]
        };
      } else {
        if(object == items.BLK_BERRY.name) {
          object = items.BLK_BERRY;
        }
        else {
          object = items[object.toUpperCase().replace(" ", "_")];
        }
        tile = {
          visible: Boolean(+visibility),
          terrain: TERRAIN_MAP[terrain],
          object: object //Can represent an item or obstacle
        };
      }
      this.tiles[(xC * this.width) + yC] = tile;//Assign the special tile to its location
    });
    for (let i = 0; i < this.tiles.length; ++i) {//Populate the remaining map with default
      if (this.tiles[i] == null) {               //values (Meadow)
        this.tiles[i] = {
          visible: false,
          terrain: TERRAIN_MAP[0]
        };
      }
    }
  }
}

export default Map;
