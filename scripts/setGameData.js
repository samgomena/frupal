import {TERRAIN_MAP} from "./terrainMap";

export function setGameData(gameData) {
  // console.log("GAME DATA ", gameData);
  // Populate map layer with map objects
  let obstacle_layer = new Array((gameData.board_size) * (gameData.board_size));
  // console.log(obstacle_layer);

  for (let i = 0; i < obstacle_layer.length; ++i)
  {
    obstacle_layer[i] = {
      x: undefined,
      y: undefined,
      visible: false,
      terrain: TERRAIN_MAP[0],
      name: ""
    };
  }

  /*
  gameData.map.objects.forEach((map_object) => {
    let index = map_object.x * map_object.y;
    obstacle_layer[index] = Object.assign(
      obstacle_layer[index],
      map_object,
    )
  });
  */
  for(let i = 0; i < gameData.map.objects.length; ++i) {
    let index = (gameData.map.objects[i].x * gameData.map.width) + gameData.map.objects[i].y;
    obstacle_layer[index] = Object.assign(obstacle_layer[index], gameData.map.objects[i]);
  }
  gameData.map.layers = obstacle_layer;


  // Perform checks

  // Throw if player's starting location is off the map
  if(gameData.player.pos.x > gameData.map.width || gameData.player.pos.y > gameData.map.height) {
    throw Error(`Starting position of (${gameData.player.pos.x}, ${gameData.player.pos.y}) is out of bounds.`);
  }

  let contains_diamonds = gameData.map.objects.filter(board_object => {
    return board_object.name === "Royal Diamonds";
  }).length;

  // Throw if more than 1 diamonds
  if(contains_diamonds !== 1) {
    throw Error("The map can only have one royal diamonds item.");
  }

  // Throw if no diamonds
  if(!contains_diamonds) {
    throw Error("The map does not contain the royal diamonds.");
  }
  // console.log("GAME DATA ", gameData);
  return gameData;
}