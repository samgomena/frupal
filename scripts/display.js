class Display {
  constructor(person) {
    this.person = person;
    this.displayEl = document.createElement("div");
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
    let locationText = `Current Location: (${location.x}, ${location.y})`;
    this.lNode.replaceData(0, 50, locationText);
    this.eNode.replaceData(0, 50, this.person.getEnergy());
    this.mNode.replaceData(0, 50, this.person.getMoney());
  }
}

export default Display;