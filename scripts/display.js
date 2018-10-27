class Display {
  constructor(person) {
    this.person = person;
    this.displayEl = document.createElement("div");
    // Location, Energy, Money nodes.
    this.lNode = document.createTextNode("Current Location: (0,0)");
    this.eNode = document.createTextNode("Energy: 100");
    this.mNode = document.createTextNode("Whiffles: 100");

    this.displayEl.appendChild(this.lNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.eNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.mNode);

    this.injectEl = document.getElementById("display");
    this.injectEl.appendChild(this.displayEl);
  }

  update() {
    const location = this.person.getLocation();
    const money = this.person.getMoney();
    const energy = this.person.getEnergy();

    const locationText = `Current Location: (${location.x}, ${location.y})`;
    const moneyText = `Whiffles: ${money}`;
    const energyText = `Energy: ${energy}`;

    this.lNode.replaceData(0, 50, locationText);
    this.eNode.replaceData(0, 50, energyText);
    this.mNode.replaceData(0, 50, moneyText);
  }
}

export default Display;