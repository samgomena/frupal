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
    constructor(context, map, hero) {
        this.ctx = context.getContext('2d');
        this.map = map;

        this.hero = hero;
        // this.camera = new Camera(this.map, 512, 512);
        // this.camera.follow(this.hero);


        context.width = (this.map.tile_size * this.map.width);
        context.height = (this.map.tile_size * this.map.height);

        console.log((this.map.tile_size * this.map.width), (this.map.tile_size * this.map.height));
        this.run();
    }

    run() {
        this._previousElapsed = 0;
        window.requestAnimationFrame(this.tick.bind(this));
    };


    update() {
        // handle hero movement with arrow keys
        let dirx = 0;
        let diry = 0;

        // TODO: Move hero here

        this.hero.move(dirx, diry);
        // this.camera.update();
    };

    tick(elapsed) {


        // clear previous frame
        this.ctx.clearRect(0, 0, 512, 512);

        // compute delta time in seconds -- also cap it
        let delta = (elapsed - this._previousElapsed) / 1000.0;
        delta = Math.min(delta, 0.25); // maximum delta of 250 ms
        this._previousElapsed = elapsed;

        this.update();
        this.render();
        window.requestAnimationFrame(this.tick.bind(this));
    }

    render() {
        this.ctx.beginPath();
        // this.ctx.arc(
        //     this.hero.x * this.map.tile_size - this.hero.width / 2,
        //     this.hero.y * this.map.tile_size - this.hero.height / 2,
        //     32,
        //     0,
        //     2 * Math.PI,
        //     false
        // );
        // console.log(this.hero.x, this.hero.y);
        this.ctx.arc(
            // this.hero.x * (this.hero.width / 2),
            // this.hero.y * (this.hero.height / 2),
            this.hero.x * (this.map.tile_size - this.hero.width) / 2,
            this.hero.y * (this.map.tile_size - this.hero.height) / 2,
            32,
            0,
            2 * Math.PI,
            false
        );
        this.ctx.stroke();

        this.drawGrid();
    };

    drawGrid() {
        let width = this.map.width * this.map.tile_size;
        let height = this.map.height * this.map.tile_size;
        let x, y;

        for(let step_x = 0, step_y = 0; step_x <= this.map.height; ++step_x, ++step_y) {
            // x = -(this.camera.x);
            y = step_x * this.map.tile_size;// - this.camera.y;
            this.ctx.beginPath();
            this.ctx.moveTo(step_x, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();

            x = step_y * this.map.tile_size;// - this.camera.x;
            // y = -(this.camera.y);
            this.ctx.beginPath();
            this.ctx.moveTo(x, step_y);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    };
}