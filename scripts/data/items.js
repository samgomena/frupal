export const ROYAL_DIAMONDS = {name: "Royal Diamonds"};
export const BINOCULARS = { name :"Binoculars", cost: 50};
export const POWER_BAR = { name: "Power Bar", cost: 1};
export const TREASURE = {name: "Treasure"};
export const TYPE_TWO = {name: "Type Two"}; // Chest
export const BOAT = { name: "Boat", cost: 100 };

/**  tools  **/
export const SHEARS = {name: "Shears", cost: 35};
export const HATCHET = {name: "Hatchet", cost: 15};
export const AXE = {name: "Axe", cost: 30};
export const WEED_WHACKER = { name: "Weed Whacker", cost: 25};
export const CHAINSAW = {name: "Chainsaw", cost: 60};
export const CHISEL = {name: "Chisel", cost: 5};
export const SLEDGE = {name: "Sledge", cost: 25};
export const JACKHAMMER = {name: "Jackhammer", cost: 100};

/**  obstacles  **/
export const TREE = { 
  name: "Tree", 
  noToolsCost: 10, 
  reducedCost: 5, 
  rightTools: [HATCHET.name, AXE.name, CHAINSAW.name],
  frameX: 221,
  frameY: 154
};

export const BOULDER = {
  name: "Boulder", 
  noToolsCost: 16, 
  reducedCost: 8, 
  rightTools: [SLEDGE.name, CHISEL.name, JACKHAMMER.name],
  frameX: 919,
  frameY: 355
};

export const BLK_BERRY = { 
  name: "Black Berry Bush", 
  noToolsCost: 4, 
  reducedCost: 2, 
  rightTools: [SHEARS.name, WEED_WHACKER.name],
  frameX: 408,
  frameY: 187
};
