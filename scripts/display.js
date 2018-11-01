class Display {
  constructor(person, map) {
    this.map = map;
    this.person = person;
    this.displayEl = document.createElement("div");

    const terrain = this.map.getPlayerLocInfo();
    // Location, Energy, Money nodes.
    // TODO: All this is not needed, remove later.
    this.lNode = document.createTextNode(`Current Location: (${this.map.playerLoc.x}, ${this.map.playerLoc.y})`);
    this.eNode = document.createTextNode("Energy: 100");
    this.mNode = document.createTextNode("Whiffles: 100");
    this.tNode = document.createTextNode(`Terrain: ${terrain}`);

    this.displayEl.appendChild(this.lNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.eNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.mNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.tNode);

    this.injectEl = document.getElementById("display");
    this.injectEl.appendChild(this.displayEl);
  }


  //return true to continue game
  update() {
    const location = this.map.getPlayerLoc();
    const terrain = this.map.getPlayerLocInfo();
    const money = this.person.getMoney();
    const energy = this.person.getEnergy();

    //check that energy hasn't run out
    if(!energy) {
    
      //pop up box
      alert("You have run out of energy :(");
      this.person.isDead();

      //TODO: game should end here

      return false;
    }


    const locationText = `Current Location: (${location.x}, ${location.y})`;
    const moneyText = `Whiffles: ${money}`;
    const energyText = `Energy: ${energy}`;

    this.lNode.replaceData(0, 50, locationText);
    this.eNode.replaceData(0, 50, energyText);
    this.mNode.replaceData(0, 50, moneyText);

    return true;
  }
}

export default Display;
