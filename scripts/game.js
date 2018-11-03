"use strict";

class Camera {
    constructor(map, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.maxX = map.width * map.tile_size - width;
        this.maxY = map.height * map.tile_size - height;
    }

    follow(sprite) {
        this.following = sprite;
        sprite.screenX = 0;
        sprite.screenY = 0;
    };

    update() {
        // assume followed sprite should be placed at the center of the screen
        // whenever possible
        this.following.screenX = this.width / 2;
        this.following.screenY = this.height / 2;

        // make the camera follow the sprite
        this.x = this.following.x - this.width / 2;
        this.y = this.following.y - this.height / 2;
        // clamp values
        this.x = Math.max(0, Math.min(this.x, this.maxX));
        this.y = Math.max(0, Math.min(this.y, this.maxY));

    };
}

export default class Game {
    constructor(canvas, map, hero, fps=5) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;

        // Setting fps > 10 has serious performance implications
        this.fps = fps;

        this.hero = hero;
        this.hero_move_queue = [];

        // this.camera = new Camera(this.map, 512, 512);
        // this.camera.follow(this.hero);

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
                // this.hero.move(up);
                this.hero_move_queue.push(up);
                break;
            case "down":
            case "ArrowDown":
            case "s":
                // this.hero.move(down);
                this.hero_move_queue.push(down);
                break;
            case "left":
            case "ArrowLeft":
            case "a":
                // this.hero.move(left);
                this.hero_move_queue.push(left);
                break;
            case "right":
            case "ArrowRight":
            case "d":
                // this.hero.move(right);
                this.hero_move_queue.push(right);
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
        document.addEventListener("keydown", e => {
            const keyName = e.key;
            const validKeys = ["w", "a", "s", "d", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

            if(validKeys.indexOf(keyName) !== -1) {
                this.moveEvent(keyName, 1);
            }
        });
    }

    sizeUpBoard() {
        // Our canvas must cover full height of screen
        // regardless of the resolution
        let height = window.innerHeight;

        // So we need to calculate the proper scaled width
        // that should work well with every resolution
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

        // Bind `tick` to `Game` so `this` is not `window`; set fps to 200 ms
        window.setTimeout(this.tick.bind(this), 1000/this.fps);
    };


    update() {
        // this.ctx.save();
        this.hero_move_queue.forEach(movement => {
            this.hero.move(movement.x, movement.y);
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