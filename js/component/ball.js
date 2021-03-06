let Vector = require('./vector.js');

const CONST = require('./../const.js');

class Ball {

    constructor(context, x, y, r, velocity, moving) {
        this.ctx = context;
        this.x = x;
        this.y = y;
        this.r = r;
        this.velocity = velocity;
        this.moving = moving;

        this.t0 = Date.now();
        this.x0 = x;
        this.y0 = y;
    }

    restart(side) {
        this.x = side == 'left' ? CONST.BALL_START_X : CONST.V_BORDER - CONST.BALL_START_X;
        this.y = CONST.BALL_START_Y;
        this.velocity = new Vector(CONST.BALL_START_V, 0);
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = CONST.BALL_COLOR;
        this.ctx.fill();
    }

    currentVelocity() {
        let v0 = this.velocity.v;
        let t = (Date.now() - this.t0) / 100;
        let alpha = this.velocity.a;

        return Math.sqrt(Math.pow(v0, 2) - 2 * v0 * CONST.G * t * Math.sin(alpha) + Math.pow(CONST.G * t, 2));
    }

    currentAngle() {
        let v0 = this.velocity.v;
        let t = (Date.now() - this.t0) / 100;
        let alpha = this.velocity.a;

        let angle = Math.atan((v0 * Math.sin(alpha) - CONST.G * t) / (v0 * Math.cos(alpha)));
        if (Math.cos(alpha) < 0) {
            angle += Math.PI;
        }

        return angle;
    }

    horizontalWallBounce(angle) {
        if (Math.sin(angle) < 0 && this.moving) {
            this.moving = false;
            var winner = this.x < CONST.NET_X ? 'right' : 'left';
            var event = new CustomEvent("win", {'detail': {'winner': winner}});
            this.ctx.canvas.dispatchEvent(event)
        } else {
            this.velocity.v = this.currentVelocity();
            this.velocity.a = 2 * Math.PI - angle;
            this.t0 = Date.now();
            this.x0 = this.x;
            this.y0 = this.y;
        }
    }

    verticalWallBounce(angle) {
        this.velocity.v = this.currentVelocity();
        this.velocity.a = Math.PI - angle;
        this.t0 = Date.now();
        this.x0 = this.x;
        this.y0 = this.y;
    }

    playerBounce(player) {
        if (this.y <= player.y) {
            this.ballBounce(player);
        } else {

            this.y += this.r - (this.y - player.y) + CONST.BALL_COLLISION_DELTA;

            this.bounce(0);
        }
    }

    netBounce(net, side) {
        if (side == 'left' || side == 'right') {
            this.x = this.x < net.x ? net.x - net.width / 2 - this.r : net.x + net.width / 2 + this.r;

            this.verticalWallBounce(this.currentAngle());
        } else if (side == 'top') {
            this.ballBounce(net.top);
        }
    }

    ballBounce(ball) {
        let k = Math.atan((this.y - ball.y) / (ball.x - this.x));
        let normal = k > 0 ? k - Math.PI / 2 : k + Math.PI / 2;

        k = k < 0 ? k + Math.PI : k;

        let deltaR = ball.r + this.r - this.distanceTo(ball) + CONST.BALL_COLLISION_DELTA;
        this.x += deltaR * Math.cos(k);
        this.y += CONST.V_DIRECTION * deltaR * Math.sin(k);

        this.bounce(normal);
    }

    bounce(angle) {
        if (!this.moving) {
            this.t0 = Date.now();
            this.x0 = this.x;
            this.y0 = this.y;

            this.velocity.a = angle + Math.PI / 2;

            this.moving = true;
        }

        this.velocity.v = this.currentVelocity();
        this.velocity.a = 2 * Math.PI - this.currentAngle() + 2 * Math.atan(angle);

        this.t0 = Date.now();
        this.x0 = this.x;
        this.y0 = this.y;
    }

    collidesWithPlayer(player) {
        if (this.y <= player.y) {
            return this.collides(player);
        }

        return (this.x > player.x - player.r && this.x < player.x + player.r) && (this.y - player.y < this.r);
    }

    collidesWithNet(net) {
        let direction = Math.sign(Math.cos(this.currentAngle()));
        let horizontalDistance = (CONST.H_BORDER - CONST.NET_HEIGHT - CONST.NET_RADIUS) - (this.y + this.r);

        let up = CONST.H_BORDER - CONST.NET_HEIGHT;

        if (horizontalDistance > 0)
            return;

        if (this.y > up) {
            if (this.x < CONST.NET_X && direction > 0 && this.x + this.r > net.left) {
                return 'left';
            } else if (this.x > CONST.NET_X && direction < 0 && this.x - this.r < net.right) {
                return 'right';
            }
        } else if (this.collides(net.top)) {
            return 'top';
        }

        return false;
    }

    collides(another) {
        let distance = Math.sqrt(Math.pow(this.x - another.x, 2) + Math.pow(this.y - another.y, 2));

        return distance <= this.r + another.r;
    }

    distanceTo(another) {
        return Math.sqrt(Math.pow(this.x - another.x, 2) + Math.pow(this.y - another.y, 2));
    }

    move() {
        if (!this.moving)
            return;

        let v0 = this.velocity.v;
        let alpha = this.velocity.a;

        let t = (Date.now() - this.t0) / 100;

        this.x = this.x0 + v0 * t * Math.cos(alpha);
        this.y = this.y0 + CONST.V_DIRECTION * (v0 * t * Math.sin(alpha) - 0.5 * CONST.G * Math.pow(t, 2));

        let angle = Math.atan((v0 * Math.sin(alpha) - CONST.G * t) / (v0 * Math.cos(alpha)));
        if (Math.cos(alpha) < 0) {
            angle += Math.PI;
        }

        if ((this.x + this.r >= CONST.V_BORDER && Math.cos(alpha) > 0)
            || (this.x - this.r <= 0 && Math.cos(alpha) < 0)) {

            this.verticalWallBounce(angle);

        } else if ((this.y - this.r <= 0 && CONST.V_DIRECTION * Math.sin(angle) < 0) || (
            this.y + this.r >= CONST.H_BORDER - CONST.FLOOR_HEIGHT && CONST.V_DIRECTION * Math.sin(angle) > 0)) {

            this.horizontalWallBounce(angle)
        }
    }
}

module.exports = Ball;