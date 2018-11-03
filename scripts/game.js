"use strict";


export default class Game {
    constructor(canvas, map, hero, fps=5) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;

        // Setting fps > 10 causes serious overallocation of resources
        this.fps = fps;

        this.hero = hero;
        this.hero_move_queue = [];

        this.setMoveEvents();

        canvas.width = (this.map.tile_size * this.map.width);
        canvas.height = (this.map.tile_size * this.map.height);

        console.log("Canvas width, height =", (this.map.tile_size * this.map.width), (this.map.tile_size * this.map.height));

        window.addEventListener('load', this.sizeUpBoard.bind(this), false);
        window.addEventListener('resize', this.sizeUpBoard.bind(this), false);
    }

    moveEvent(moveId) {
        const up = { x: 0, y: -1 };
        const down = { x: 0, y: 1 };
        const left = { x: -1, y: 0 };
        const right = { x: 1, y: 0 };

        switch(moveId) {
            case "up":
            case "ArrowUp":
            case "w":
                this.hero_move_queue.push(up);
                break;
            case "down":
            case "ArrowDown":
            case "s":
                this.hero_move_queue.push(down);
                break;
            case "right":
            case "ArrowRight":
            case "d":
                this.hero_move_queue.push(right);
                break;
            case "left":
            case "ArrowLeft":
            case "a":
                this.hero_move_queue.push(left);
                break;

            default:
                throw new Error("Not an event!");
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
        document.addEventListener("keypress", e => {
            const keyName = e.key;
            const validKeys = ["w", "a", "s", "d", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

            if(validKeys.indexOf(keyName) !== -1) {
                this.moveEvent(keyName, 1);
            }
        });
    }

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

    run() {
        this._previousElapsed = 0;
        // window.requestAnimationFrame(this.tick);

        // Bind `tick` to `Game` so `this` is not `window`
        window.setTimeout(this.tick.bind(this), 1000/this.fps);
    };


    update() {
        // this.ctx.save();
        this.hero_move_queue.forEach(movement => {
            this.hero.move(movement.x, movement.y);
            // Meh...
            this.hero_move_queue.shift();
        });
    };

    tick(elapsed) {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.update();
        this.render();

        window.setTimeout(this.tick.bind(this), 1000/5);
    }

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