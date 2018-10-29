// Overlay class file, should handle start and option screens

class Overlay {
    constructor() {
        this.start = document.createElement("a")
        this.start.innerHTML = "Start"
        this.start.setAttribute("href", "javascript:void(0)")
        this.start.addEventListener("click", function(){
            document.getElementById('menu').style.display = "none"
        })

        this.options = document.createElement("a")
        this.options.innerHTML = "Options"
        this.options.setAttribute("href", "javascript:void(0)")
        this.options.addEventListener("click", function(){
            document.getElementById('options').style.display = "block"
        })
        document.getElementById("sub").appendChild(this.start)
        document.getElementById("sub").appendChild(this.options)

        // Need to add second options overlay here
        this.submit = document.createElement("input")
        this.submit.value = "Create"
        this.submit.type = "button"
        this.submit.addEventListener("click", function(){
            let input = document.getElementsByName("in")
            let map  = input[0].value
            let size  = input[1].value
            let loc  = input[2].value
            let energy = input[3].value
            let money = input[4].value
            let items = input[5].value
            let tiles = input[6].value
            localStorage.setItem(map, JSON.stringify([size,loc,energy,money,items,tiles]))
        })
        this.close = document.createElement("a")
        this.close.innerHTML = "&times"
        this.close.setAttribute("href", "javascript:void(0)")
        this.close.setAttribute("style", "position:absolute;top:0px;right:0px;")
        this.close.addEventListener("click", function(){
            document.getElementById("options").style.display = "none"
        })

        document.getElementById("form").appendChild(this.submit)
        document.getElementById("options").appendChild(this.close)
    }
}

export default Overlay
