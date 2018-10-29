// Overlay class file, should handle start and option screens

class Overlay {
    constructor() {
        this.start = document.createElement("a")
        this.start.innerHTML = "Start"
        this.start.setAttribute("href", "javsacript:void(0)")
        this.start.addEventListener("click", function(){
            document.getElementById('menu').style.display = "none"
        })

        this.options = document.createElement("a")
        this.options.innerHTML = "Options"
        this.options.setAttribute("href", "javsacript:void(0)")
        this.options.addEventListener("click", function(){
            document.getElementById('options').style.display = "block"
        })
        document.getElementById("sub").appendChild(this.start)
        document.getElementById("sub").appendChild(this.options)

        // Need to add second options overlay here
    }
}

export default Overlay
