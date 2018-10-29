import Person from "./person.js"
import Display from "./display.js"

var Hero = new Person("Ben", {x:0,y:0}, 100, 100) 
var HUD = new Display(Hero)

HUD.up.addEventListener("click", function(){
    Hero.goUp()
    Hero.consumeEnergy(1)
    HUD.update(Hero)
})
HUD.down.addEventListener("click", function(){
    Hero.goDown()
    Hero.consumeEnergy(1)
    HUD.update(Hero)
})
HUD.left.addEventListener("click", function(){
    Hero.goLeft()
    Hero.consumeEnergy(1)
    HUD.update(Hero)
})
HUD.right.addEventListener("click", function(){
    Hero.goRight()
    Hero.consumeEnergy(1)
    HUD.update(Hero)
})
