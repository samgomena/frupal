class Display {
    constructor(person) {
        this.displayEl = document.createElement("p")
        this.lNode = document.createTextNode("Current Location: (0,0)")
        this.eNode = document.createTextNode("Energy: 100")
        this.mNode = document.createTextNode("Whiffles: 100")

        this.displayEl.appendChild(this.lNode)
        this.displayEl.appendChild(document.createElement("br"))
        this.displayEl.appendChild(this.eNode)
        this.displayEl.appendChild(document.createElement("br"))
        this.displayEl.appendChild(this.mNode)

        this.injectEl = document.getElementById("display")
        this.injectEl.appendChild(this.displayEl)

        this.up = document.createElement("button")
        this.up.appendChild(document.createTextNode("Up"))
        this.injectEl.appendChild(this.up)
        this.down = document.createElement("button")
        this.down.appendChild(document.createTextNode("Down"))
        this.injectEl.appendChild(this.down)
        this.left = document.createElement("button")
        this.left.appendChild(document.createTextNode("Left"))
        this.injectEl.appendChild(this.left)
        this.right = document.createElement("button")
        this.right.appendChild(document.createTextNode("Right"))
        this.injectEl.appendChild(this.right)
    }
    
    update(person) {
        let location = person.getLocation()
        let money = person.getMoney()
        let energy = person.getEnergy()

        let lText = `Current Location : (${location.x}, ${location.y})`
        let mText = `Whiffles: ${money}`
        let eText = `Energy: ${energy}`

        this.lNode.replaceData(0, 50, lText)
        this.mNode.replaceData(0, 50, mText)
        this.eNode.replaceData(0, 50, eText)
    }
}

export default Display
