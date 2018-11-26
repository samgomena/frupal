class Display {
  constructor(person, map) {
    // TODO: Make display render inside the game display (Upper right corner).
    this.map = map;
    this.hero = person;
    this.displayEl = document.getElementById("display");
    // Location, Energy, Money nodes.
    if(this.displayEl.innerHTML == "") {
      this.createNodes();
    }
  }



  //return true to continue game
  update() {
    const location = this.hero.getPlayerLoc();
    const terrain = this.hero.getPlayerLocInfo();
    const money = this.hero.getMoney();
    const energy = this.hero.getEnergy();
    let item = this.hero.getPlayerLocItem();
    const inventory = this.hero.getPlayerInventory();

    const locationText = `Current Location: (${location.x + 1}, ${location.y + 1})`;
    const moneyText = `Whiffles: ${money}`;
    const energyText = `Energy: ${energy}`;
    const terrainText = `Terrain: ${terrain}`;
    if (item !== "None") {
      item = item.name;
    }
    const itemText = `Item: ${item}`;
    const invText = `Inventory: ${inventory.toString()}`;

    try {
      this.lNode.replaceData(0, 50, locationText);
      this.eNode.replaceData(0, 50, energyText);
      this.mNode.replaceData(0, 50, moneyText);
      this.tNode.replaceData(0, 50, terrainText);
      this.iNode.replaceData(0, 50, itemText);
      this.inNode.replaceData(0, 50, invText);
    } catch (err) {
      // Makes sure duplicates are not created during HMR
      this.displayEl.innerHTML = "";
      this.createNodes();
    }


    return true;
  }

  createNodes() {
    const terrain = this.hero.getPlayerLocInfo();
    const item = this.hero.getPlayerLocItem();
    const inventory = this.hero.getPlayerInventory(); 
    this.lNode = document.createTextNode(`Current Location: (${this.hero.x}, ${this.hero.y})`);
    this.eNode = document.createTextNode("Energy: 100");
    this.mNode = document.createTextNode("Whiffles: 100");
    this.tNode = document.createTextNode(`Terrain: ${terrain}`);
    this.iNode = document.createTextNode(`Item: ${item}`);
    this.inNode = document.createTextNode(`Inventory: ${inventory.toString()}`);

    this.displayEl.appendChild(this.lNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.eNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.mNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.tNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.iNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.inNode);

  }
}

export default Display;
