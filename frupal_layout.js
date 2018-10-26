// Testing js file for frupal framework

class Person {
    constructor(name, location, energy, money) {
        this.name = name
        this.location = location
        this.energy = energy
        this.money = money
    }
    printInfo() {
        return `Name: ${this.name}\n`
            +`Location: (${this.location.x},${this.location.y})\n`
            +`Energy: ${this.energy}\n`
            +`Money: ${this.money}\n`
    }
    getLocation() {
        return "Current Location: ("+this.location.x+","+this.location.y+")"
    }
    getEnergy() {return "Energy: " + this.energy}
    getMoney() {return "Whiffles: " + this.money}
    goUp() {--this.location.y}
    goDown() {++this.location.y}
    goLeft() {--this.location.x}
    goRight() {++this.location.x}

    // consumeEnergy should eventually take a tile type
    // as an argument to decide how much energy is lost
    // during movement.
    consumeEnergy() {--this.energy}
}

