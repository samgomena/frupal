class Display {
  constructor(person, map) {
    // TODO: Make display render inside the game display (Upper right corner).
    this.map = map;
    this.hero = person;
    this.inv_items = document.getElementById("invItems");
    this.displayEl = document.getElementById("display");
    this.currInvLen = 0;
    // Location, Energy, Money nodes.
    if(this.displayEl.innerHTML == "") {
      this.createNodes();
    }

    if(this.inv_items.innerHTML == ""){
      this.createInvNode();
      let showButton = document.getElementById("invShow");
      let hideButton = document.getElementById("invHide");
      showButton.addEventListener("click", () => {
        showButton.style["display"] = "none";
        hideButton.style["display"] = "block";
        this.inv_items.style["display"] = "block";
      });

      hideButton.addEventListener("click", () => {
        showButton.style["display"] = "block";
        hideButton.style["display"] = "none";
        this.inv_items.style["display"] = "none";
      });

    }
  }
  updateInventory() {
    this.inv_items.innerHTML = "";
    let invHeaderText = document.createTextNode("Inventory");
    let invHeaderNode = document.createElement("div");
    // OH MY GAWD AAAAHHHH OKAY OKAY IT'S DONE
    invHeaderNode.style["text-align"] = "center";
    invHeaderNode.appendChild(invHeaderText);

    let nameText = document.createTextNode("Name:");
    let costText = document.createTextNode("Cost:");
    let nameNode = document.createElement("div");
    let costNode = document.createElement("div");
    let headerNode = document.createElement("div");
    nameNode.appendChild(nameText);
    costNode.appendChild(costText);
    headerNode.appendChild(nameNode);
    headerNode.appendChild(costNode);
    // RAAAAAAAA IT'S SO GROSS AAAAHHH
    headerNode.style["display"] = "flex";
    headerNode.style["flex-direction"] = "row";
    headerNode.style["justify-content"] = "space-evenly";
    this.inv_items.appendChild(invHeaderNode);
    this.inv_items.appendChild(headerNode);

    let inventory = this.hero.getPlayerInventory();
    this.currInvLen = inventory.length;
    const invItems = inventory.map(a => a.name);
    const itemCosts = inventory.map(a => a.cost);
    for(let i = 0; i < invItems.length; ++i) {
      let itemName = document.createTextNode(invItems[i]);
      let itemCost = document.createTextNode(itemCosts[i]);
      let itemNameNode = document.createElement("div");
      let itemCostNode = document.createElement("div");
      let itemNode = document.createElement("div");
      itemCostNode.appendChild(itemCost);
      itemNameNode.appendChild(itemName);
      itemNode.appendChild(itemNameNode);
      itemNode.appendChild(itemCostNode);
      // ITEM NODE STYLING BECAUSE I'M LAZY
      itemNode.style["display"] = "flex";
      itemNode.style["flex-direction"] = "row";
      itemNode.style["justify-content"] = "space-evenly";
      this.inv_items.appendChild(itemNode);
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
    if(inventory.length > this.currInvLen) {
      this.updateInventory();
    }

    const locationText = `Current Location: (${location.x + 1}, ${location.y + 1})`;
    const moneyText = `Whiffles: ${money}`;
    const energyText = `Energy: ${energy}`;
    const terrainText = `Terrain: ${terrain}`;
    if (item !== "None") {
      item = item.name;
    }
    const itemText = `Item: ${item}`;
    const invText = `Inventory: ${invItems.toString()}`;

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

  createInvNode() {
    const inventory = this.hero.getPlayerInventory();
    this.inNode = document.createTextNode(`Inventory: ${inventory.toString()}`);
    this.inv_items.appendChild(this.inNode);
  }

  createNodes() {
    const terrain = this.hero.getPlayerLocInfo();
    const item = this.hero.getPlayerLocItem();
    //const inventory = this.hero.getPlayerInventory();
    this.lNode = document.createTextNode(`Current Location: (${this.hero.x}, ${this.hero.y})`);
    this.eNode = document.createTextNode("Energy: 100");
    this.mNode = document.createTextNode("Whiffles: 100");
    this.tNode = document.createTextNode(`Terrain: ${terrain}`);
    this.iNode = document.createTextNode(`Item: ${item}`);
    //this.inNode = document.createTextNode(`Inventory: ${inventory.toString()}`);

    this.displayEl.appendChild(this.lNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.eNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.mNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.tNode);
    this.displayEl.appendChild(document.createElement("br"));
    this.displayEl.appendChild(this.iNode);
    //this.displayEl.appendChild(document.createElement("br"));
    //this.displayEl.appendChild(this.inNode);

  }
}

export default Display;
