import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';

export default class Asteroid {
    constructor(args) {
        this.position = args.position
        this.velocity = {
            x: randomNumBetween(-2, 2),
            y: randomNumBetween(2, 2)
        }
        this.rotation = 0;
        this.rotationSpeed = randomNumBetween(-2, 2)
        this.radius = args.size;
        this.score = (80 / this.radius) * 5;
        this.create = args.create;
        this.addScore = args.addScore;
        this.vertices = asteroidVertices(8, args.size)
    }

    destory() {
        this.delete = true;
        this.addScore(this.score);

        //Create particle explosion
        for (let i = 0; i < this.radius; i++) {
            const particle = new Particle({
                lifeSpan: randomNumBetween(50, 100),
                size: randomNumBetween(1, 3),
                position: {
                    x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
                    y: this.position.x + randomNumBetween(-this.radius / 4, -this.radius / 4)
                },
                velocity: {
                    x: randomNumBetween(-2, 2),
                    y: randomNumBetween(-2, 2)
                }
            });
            this.create(particle, 'particles');
        }

        //Break into more asteroids
        if (this.radius > 15) {
            let newasteroids = randomNumBetween(2, 4);
            let i = newasteroids;
            while (i > 0) {
                let asteroid = new Asteroid({
                    size: this.radius / newasteroids,
                    position: {
                        x: randomNumBetween(-10, 20) + this.position.x,
                        y: randomNumBetween(-10, 20) + this.position.y
                    },
                    create: this.create.bind(this),
                    addScore: this.addScore.bind(this)
                });


                i--;
            }
        }


    }

    render(state) {
        // Move
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Rotation
        this.rotation += this.rotationSpeed;
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        if (this.rotation < 0) {
            this.rotation += 360;
        }

        // Screen edges
        if (this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
        else if (this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
        if (this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
        else if (this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.strokeStyle = '#FFF';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -this.radius);
        for (let i = 1; i < this.vertices.length; i++) {
            context.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        context.closePath();
        context.stroke();
        context.restore();
    }
}
