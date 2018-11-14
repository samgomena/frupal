class Display {
  constructor(person, map) {
    this.map = map;
    this.hero = person;
    this.displayEl = document.createElement("div");

    const terrain = this.hero.getPlayerLocInfo();
    const item = this.hero.getPlayerLocItem();

    // Location, Energy, Money nodes.
    // FIXME: Make it look prettier?
    this.lNode = document.createTextNode(`Current Location: (${this.hero.x}, ${this.hero.y})`);
    this.eNode = document.createTextNode("Energy: 100");
    this.mNode = document.createTextNode("Whiffles: 100");
    this.tNode = document.createTextNode(`Terrain: ${terrain}`);
    this.iNode = document.createTextNode(`Item: ${item}`);

    this.displayEl.appendChild(this.lNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.eNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.mNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.tNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.iNode);

    this.injectEl = document.getElementById("display");
    this.injectEl.appendChild(this.displayEl);
  }


  //return true to continue game
  update() {
    const location = this.hero.getPlayerLoc();
    const terrain = this.hero.getPlayerLocInfo();
    const money = this.hero.getMoney();
    const energy = this.hero.getEnergy();
    const item = this.hero.getPlayerLocItem();

    //check that energy hasn't run out
    // FIXME: Display should not control if game ends.
    if(energy <= 0) {
      return false;
    }
    if(item === "Royal Diamonds") {

        alert("You found the jewels!!!!!! You Win!!");

        //Reload the game to default
        window.location.reload(true);

        //TODO: game should end here
        //return false;
    }
    if (item === "Binoculars") {
      //alert("You found a pair of binoculars!");
      this.hero.hasBinoculars();
    }
    const locationText = `Current Location: (${location.x + 1}, ${location.y + 1})`;
    const moneyText = `Whiffles: ${money}`;
    const energyText = `Energy: ${energy}`;
    const terrainText = `Terrain: ${terrain}`;
    const itemText = `Item: ${item}`;

    this.lNode.replaceData(0, 50, locationText);
    this.eNode.replaceData(0, 50, energyText);
    this.mNode.replaceData(0, 50, moneyText);
    this.tNode.replaceData(0, 50, terrainText);
    this.iNode.replaceData(0, 50, itemText);

    return true;
  }

  reset() {
    // TODO: Reset display.
  }
}

export default Display;
