## Welcome to the game of frupal.
You can play it [here](http://web.cecs.pdx.edu/~gomenas/frupal/dist/)!

## Basic Gameplay

You have been stranded on the island of Frupal (think Tom Hanks in Cast Away) and the only way that you can get off the island is to find the Royal Diamonds. You have been given a stipend of approximately one thousand whiffles (the units of currency on the island of Frupal) with which you can purchase items you find on the island in the hope that they will ease your Royal Diamond finding endeavors. As well, you have been stranded with no food and as such, your energy will diminish as you adventure around the island, to the tune of one unit of energy per move -- given that you are not moving through a bog or any sort of extraneous obstacles. Oh, and you'll die if you don't find the Royal Diamonds before you run out of energy. Good Luck!

#### Moving around
Use `a` `w` `s` `d`, `left` `right` `up` `down`, or the `North` `South` `East` `West` buttons.

#### Items
Every time you come across an item on the island you will be prompted to interact with it.
**Note**: You'll have to click the `Nice` button before you can move along.

###### Some possible items you can come across are
* Binoculars
* A Boat
* A Chainsaw
* A Jackhammer
* A Weed Whacker
* A Power Bar
* A Treasure Chest 
* A Treasure Chest (that will take all your money)

#### Obstacles
As you move about the island you'll come across obstacles and again, will be prompted to interact with them.
**Note**: Obstacles, like items, will require you to interact with them and some obstacles like water will require you to have an item to interact with them. 

###### Some Possible obstacles you can come across are
* Water
* A Boulder
* Blackberry Bushes
* A Tree

#### Tips for playing

* If you find a pair of binoculars, you're vision in each direction will increase two fold.
* The items you find have value outside of their price, for instance you will use less energy taking down a tree if you have an axe.
* You will need a boat if you're interested in travlling across water.
* A power bar will give you more energy!
* Be wary of treasure chests; there's no way to tell between which will take your money and which won't.
* If you find yourself at the edge of the island, you can (perhaps surprisingly) loop around to the other side.

## The software behind Frupal   [![Build Status](https://travis-ci.com/samgomena/frupal.svg?token=wrqdxNSxDZXR1zjtheDr&branch=sgomena/dev)](https://travis-ci.com/samgomena/frupal)

Frupal is an entirely browser based game that utilizes `HTML5`'s Canvas API and `ES6`.
It has no runtime dependencies and compiles to approximately 347k minified and gzipped.

### Dependencies
* [npm](https://www.npmjs.com/get-npm)
* [parcel](https://parceljs.org/getting_started.html)
* [mocha](https://mochajs.org/)
* [karma](https://karma-runner.github.io/latest/index.html)

Or to get the current list
`npm list --depth 0`

### Installing & Running
Install npm dependencies
```bash
# Install Dependencies
npm install

# Run in development mode
npm run serve
```

### Building
```bash
npm run build
```

### Testing 

Testing for production is done in two phases:
* Smoke and unit testing with `mocha` (Smoke tests ran in CI)
* Integration testing exclusively in CI with `nightwatch` and `selenium`

To run unit tests locally
```bash
npm test
```
