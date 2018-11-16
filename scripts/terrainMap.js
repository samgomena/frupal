const TERRAIN_MAP = {
  0: {
    name: "MEADOW",
    cost: 1,
    color: "#32CD32",
    canEnter: true
  },
  1: {
    name: "FOREST",
    cost: 1,
    color: "#0c854e",
    canEnter: true
  },
  2: {
    name: "WATER",
    cost: 1,
    color: "#218aff",
    canEnter: false
  },
  3: {
    name: "WALL",
    cost: 1,
    color: "#a7a0a5",
    canEnter: false
  },
  4: {
    name: "BOG",
    cost: 2,
    color: "#5b4a4d",
    canEnter: true
  },
  5: {
    name: "SWAMP",
    cost: 2,
    color: "#475b41",
    canEnter: true
  }
};

module.exports = {
  TERRAIN_MAP: TERRAIN_MAP,
};
