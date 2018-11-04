"use strict";

/**
 * This class is responsible for initializing the height and width of the canvas element that serves as the
 * game board. It also binds event listeners to the keys responsible for moving the hero around the map.
 */
export default class Game {
    constructor(canvas, map, hero, display, fps=5) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;

        // Setting fps > 10 causes serious overallocation of resources
        this.fps = fps;

        this.hero = hero;

        // Queue that propagates move events across game refreshes
        this.hero_move_queue = [];

        this.display = display;

        // Bind move events
        this.setMoveEvents();

        canvas.width = (this.map.tile_size * this.map.width);
        canvas.height = (this.map.tile_size * this.map.height);

        window.addEventListener('load', this.sizeUpBoard.bind(this), false);
        window.addEventListener('resize', this.sizeUpBoard.bind(this), false);
    }

    moveEvent(moveId) {

        switch(moveId) {
            case "up":
            case "ArrowUp":
            case "w":
                this.hero_move_queue.push(this.hero.up);
                break;
            case "down":
            case "ArrowDown":
            case "s":
                this.hero_move_queue.push(this.hero.down);
                break;
            case "right":
            case "ArrowRight":
            case "d":
                this.hero_move_queue.push(this.hero.right);
                break;
            case "left":
            case "ArrowLeft":
            case "a":
                this.hero_move_queue.push(this.hero.left);
                break;
            default:
                // throw new Error("Not an event!");
                console.log("That key doesn't do anything!");
        }
    }

    setMoveEvents() {

        // Define up, down, left, right, elements and attach click events to them
        ["up", "down", "left", "right"].forEach(direction => {
            document.getElementById(direction).addEventListener("click", () => {
                this.moveEvent(direction);
            });
        });

        // e stands for event
        document.addEventListener("keydown", e => {
            const keyName = e.key;
            const validKeys = ["w", "a", "s", "d", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

            if(validKeys.indexOf(keyName) !== -1) {
                this.moveEvent(keyName, 1);
            }
        });
    }

    /**
     * This function dynamically sets the games canvas element size and bitmap resolution.
     */
    sizeUpBoard() {
        // Canvas height fills screen regardless of resolution
        let height = window.innerHeight;

        // Scale resolution
        let ratio = this.canvas.width / this.canvas.height;
        let width = height * ratio;

        // Update canvas element's bitmap resolution
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        window.display.w = width;
        window.display.h = height;
    }

    /**
     * This function is the main entry point for `Game` class.
     *
     * It defines the event loop (`setTimeout(...)`) with a callback to the
     * tick function that's bound to a `game` instance.
     *
     * It runs the game loop indefinitely at `this.fps` frames per second.
     */
    run() {
        // Bind `tick` to `Game` so `this` is not `window`
        window.setTimeout(this.tick.bind(this), 1000/this.fps);
    };

    /**
     * This function is responsible for executing game updates and rendering the updates.
     */
    tick() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.update();
        this.display.update();
        this.render();

        window.setTimeout(this.tick.bind(this), 1000/5);
    }

    /**
     * This function consumes the move events in `hero_move_queue` and executes them sequentially.
     */
    update() {
        this.hero_move_queue.forEach(movement => {
            this.hero.move(movement.x, movement.y);
            // Meh...
            this.hero_move_queue.shift();
        });
    };

    /**
     * This function draws the 'hero' (a circle, for now)
     */
    render() {

        this.ctx.beginPath();
        this.ctx.arc(
            (this.hero.x * this.map.tile_size) - (this.hero.width / 2),
            (this.hero.y * this.map.tile_size) - (this.hero.height / 2),
            32,
            0,
            2 * Math.PI,
            false
        );
        this.ctx.stroke();
        // this.ctx.restore();

        this.drawGrid();
    };

    /**
     * This function draws the grid on the game's canvas element.
     *
     * Each tile on the grid is defined by the maps `tile_size`.
     */
    drawGrid() {
        let width = this.map.width * this.map.tile_size;
        let height = this.map.height * this.map.tile_size;
        let x, y;

        // Draw horizontal grid lines
        for (let step_x = 0; step_x <= this.map.height; ++step_x) {
            y = step_x * this.map.tile_size;
            this.ctx.beginPath();
            this.ctx.moveTo(step_x, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        // Draw vertical grid lines
        for (let step_y = 0; step_y <= this.map.width; ++step_y) {
            x = step_y * this.map.tile_size;
            this.ctx.beginPath();
            this.ctx.moveTo(x, step_y);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    };
}