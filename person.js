// Person class manages the character played in frupal

class Person {
    constructor(name, location, energy, money) {
        this.name = name
        this.location = location
        this.energy = energy
        this.money = money
        this.dead = false
    }
    printStatus() {
        return `Name: ${this.name}\n`
            +`Location: (${this.location.x},${this.location.y})\n`
            +`Energy: ${this.energy}\n`
            +`Money: ${this.money}\n`
    }
    getLocation() {return this.location}
    getEnergy() {return this.energy}
    getMoney() {return this.money}
    goUp() {
        if(!this.location.x)
            return
        --this.location.y
    }
    goDown() {++this.location.y}
    goLeft() {
        if(!this.location.x)
            return
        --this.location.x
    }
    goRight() {++this.location.x}

    // consumeEnergy should eventually take a tile type
    // as an argument to decide how much energy is lost
    // during movement.
    consumeEnergy(lost) {
        if(!this.energy)
            this.dead = true
        this.energy -= lost
    }
}

export default Person
