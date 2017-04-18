/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	 (function() {

	        const CONST = __webpack_require__(1);

	        const Vector = __webpack_require__(2);
	        const Ball = __webpack_require__(3);
	        const Net = __webpack_require__(4);
	        const Player = __webpack_require__(5);
	        const Wave = __webpack_require__(6);

	        const WAVE_CONFIG = __webpack_require__(8);

	        const CANVAS = document.getElementById("can");

	        CANVAS.width = CONST.V_BORDER;
	        CANVAS.height = CONST.H_BORDER;

	        let context = CANVAS.getContext("2d");

	        let ball = new Ball(context, CONST.BALL_START_X, CONST.BALL_START_Y, CONST.BALL_RADIUS, new Vector(CONST.BALL_START_V, 0));
	        let player1 = new Player(context, CONST.PLAYER_START_H_DELTA, CONST.H_BORDER - CONST.FLOOR_HEIGHT, CONST.PLAYER_RADIUS, 
	            'a', 'd', 'w', 0, 500, CONST.PLAYER_COLOR_1, 'left');
	        let player2 = new Player(context, CONST.V_BORDER - CONST.PLAYER_START_H_DELTA, CONST.H_BORDER - CONST.FLOOR_HEIGHT, CONST.PLAYER_RADIUS, 
	            'left', 'right', 'up', 510, 1010, CONST.PLAYER_COLOR_2, 'right');

	        CANVAS.players = [player1, player2];

	        let net = new Net(context, CONST.NET_X, CONST.NET_HEIGHT, CONST.NET_WIDTH, CONST.NET_COLOR);

	        let waves = [new Wave(context, WAVE_CONFIG.opt3), new Wave(context, WAVE_CONFIG.opt2), new Wave(context, WAVE_CONFIG.opt1)];

	        CANVAS.addEventListener('win', function(e) {
	            CANVAS.players.forEach(function(player,index){
	                if (e.detail.winner == player.side) {
	                    player.win();
	                    ball.restart(e.detail.winner);
	                }
	            });
	        }, false);

	        CANVAS.addEventListener('gameover', function(e) {
	            window.location.href = `gameover.html?winner=${e.detail.winner}`;
	        }, false);

	        animate();

	        function animate() {
	            requestAnimationFrame(function() {
	                animate();
	            });
	            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

	            drawWaves(context);
	            drawFloor(context);

	            if (ball.collidesWithPlayer(player1)) {
	                ball.playerBounce(player1);
	            }

	            if (ball.collidesWithPlayer(player2)) {
	                ball.playerBounce(player2);
	            }

	            let side;
	            if (side = ball.collidesWithNet(net)) {
	                ball.netBounce(net, side);
	            }

	            ball.move();
	            player1.move();
	            player2.move();

	            ball.draw(context);
	            player1.draw(context);
	            player2.draw(context);

	            net.draw(context);
	        }

	        function drawFloor(context) {

	            context.beginPath();
	            context.moveTo(0, CONST.H_BORDER);
	            context.lineTo(0, CONST.H_BORDER - CONST.FLOOR_HEIGHT);
	            context.lineTo(CONST.V_BORDER, CONST.H_BORDER - CONST.FLOOR_HEIGHT);
	            context.lineTo(CONST.V_BORDER, CONST.H_BORDER);
	            context.fillStyle = '#7FE398';
	            context.fill();

	        }

	        function drawWaves(context) {
	            waves.forEach(function(wave,index){
	                wave.updatePoints();
	                wave.renderShape(context);
	            });
	        }
	    })();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = Object.freeze({
		G: 9.8,
		TIME_SCALE: 100,
		REPEAT_INTERVAL: 1, //Milliseconds

		V_DIRECTION: -1,

		V_BORDER: 1010,
		H_BORDER: 500,

		PLAYER_STEP: 20,
		PLAYER_H_VELOCITY: 5,
		PLAYER_JUMP_VELOCITY: 50,
		PLAYER_START_H_DELTA: 250,
		PLAYER_RADIUS: 50,
		PLAYER_COLOR_1: '#F04B00',
		PLAYER_COLOR_2: '#0096FF',

		NET_X: 505,
		NET_HEIGHT: 100,
		NET_WIDTH: 10,
		NET_RADIUS: this.NET_WIDTH / 2,
		NET_COLOR: '#F0D282',

		BALL_START_X: 300,
		BALL_START_Y: 350,
		BALL_START_V: 50,
		BALL_RADIUS: 20,
		BALL_COLLISION_DELTA: 10,
		BALL_COLOR: '#FFC814',

		FLOOR_HEIGHT: 20,

		WIN_SCORE: 5,
	})

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	class Vector {

	    constructor(v, angle) {
	        this.v = v;
	        this.a = angle * (Math.PI / 180);
	    }
	}

	module.exports = Vector;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	let Vector = __webpack_require__(2);

	const CONST = __webpack_require__(1);

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
	        if (Math.sin(angle) < 0) {
	            this.moving = false;
	            var winner = this.x < CONST.V_BORDER / 2 ? 'right' : 'left';
	            var event = new CustomEvent("win", {'detail': {'winner': winner}});
	            this.ctx.canvas.dispatchEvent(event);
	        }

	        this.velocity.v = this.currentVelocity();
	        this.velocity.a = 2 * Math.PI - angle;
	        this.t0 = Date.now();
	        this.x0 = this.x;
	        this.y0 = this.y;
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
	            let deltaR = this.r - (this.y - player.y) + CONST.BALL_COLLISION_DELTA;
	            this.y += deltaR;

	            this.bounce(0);
	        }
	    }

	    netBounce(net, side) {
	        if (side == 'left' || side == 'right') {
	            this.x = this.x < net.x ? net.x - net.width / 2 - this.r : net.x + net.width / 2 + this.r;

	            this.verticalWallBounce(ball.currentAngle());
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	const CONST = __webpack_require__(1);

	class Net {

	    constructor(context, x, height, width, color) {
	        this.ctx = context;
	        this.x = x;
	        this.height = height;
	        this.width = width;
	        this.color = color;

	        this.top = {x: x, y: CONST.H_BORDER - this.height, r: CONST.NET_RADIUS};
	        this.left = x - CONST.NET_RADIUS;
	        this.right = x + CONST.NET_RADIUS;
	    }

	    draw() {
	        this.ctx.beginPath();
	        this.ctx.moveTo(this.x - this.width / 2, CONST.H_BORDER);
	        this.ctx.lineTo(this.x - this.width / 2, CONST.H_BORDER - this.height);
	        this.ctx.arc(this.x, CONST.H_BORDER - this.height, this.width / 2, Math.PI, 0, false);
	        this.ctx.lineTo(this.x + this.width / 2, CONST.H_BORDER);
	        this.ctx.fillStyle = this.color;
	        this.ctx.fill();

	    }

	}

	module.exports = Net;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	const CONST = __webpack_require__(1);

	class Player {

	    constructor(context, x, y, r, _left, _right, _up, xLeft, xRight, color, side) {

	        this.ctx = context;
	        this.x = x;
	        this.y = y;
	        this.r = r;
	        this.xLeft = xLeft;
	        this.xRight = xRight;
	        this.color = color;
	        this.vx = 0;
	        this.vy = 0;
	        this.v = 0;
	        this.y0 = y;
	        this.t0 = 0;
	        this.side = side;
	        this.ctrl = {
	            left: _left,
	            right: _right,
	            up: _up
	        }
	        this.isCtrls = true;
	        this.score = 0;
	        this.sign = this.side == 'left' ? 1 : -1;
	        this.bindKeys();
	    }

	    win() {
	        this.score++;
	        if (this.score >= CONST.WIN_SCORE) {
	            var event = new CustomEvent("gameover", {'detail': {'winner': this.side}});
	            this.ctx.canvas.dispatchEvent(event);
	        }
	    }

	    hideCtrls() {
	        this.isCtrls = false;
	    }

	    draw() {
	        this.ctx.beginPath();
	        this.ctx.arc(this.x, this.y, this.r, Math.PI, 0, false);
	        this.ctx.fillStyle = this.color;
	        this.ctx.fill();
	        //eye
	        this.ctx.beginPath();
	        let sign = this.side == 'left' ? -1 : 1;
	        this.ctx.arc(this.x - sign * (this.r / 2 - 3), this.y - this.r / 2 + 3, this.r / 3, 0, 2 * Math.PI, false);
	        this.ctx.fillStyle = 'white';
	        this.ctx.fill();
	        this.ctx.beginPath();
	        this.ctx.arc(this.x - sign * (this.r / 2), this.y - this.r / 2, this.r / 8, 0, 2 * Math.PI, false);
	        this.ctx.fillStyle = 'black';
	        this.ctx.fill();

	        this.drawScore();
	        if (this.isCtrls) {
	            this.drawCtrls();
	        }
	    }

	    drawScore() {
	        this.ctx.beginPath();
	        this.ctx.font = '128px serif';
	        this.ctx.fillStyle = this.color;
	        this.ctx.textAlign = "center";
	        let x = this.side == 'left' ? 0 : CONST.V_BORDER;
	        this.ctx.fillText(this.score, x + this.sign * 100, 150);
	    }

	    drawCtrls() {
	        //505 => ?? 50 10 50 10 50 ??
	        //w=50, gap=10
	        //167.5=(V_BORDER/2-w*3-gap*2)/2
	        this.ctx.font = '24px serif';
	        this.ctx.textAlign = "center";


	        this.ctx.lineWidth = 1;
	        this.ctx.strokeStyle = this.color;

	        let x = this.side == 'left' ? 0 : CONST.V_BORDER;

	        this.ctx.beginPath();
	        this.ctx.moveTo(x + this.sign * 167.5, CONST.H_BORDER - 150);
	        this.ctx.lineTo(x + this.sign * (167.5 + 50), CONST.H_BORDER - 150);
	        this.ctx.lineTo(x + this.sign * (167.5 + 50), CONST.H_BORDER - (150 + 50));
	        this.ctx.lineTo(x + this.sign * 167.5, CONST.H_BORDER - (150 + 50));
	        this.ctx.closePath();
	        this.ctx.stroke();

	        this.ctx.strokeText(this.ctrl.left, x + this.sign * (167.5 + 50 / 2), CONST.H_BORDER - (150 + 50 / 2 - 24 / 4));

	        this.ctx.beginPath();
	        this.ctx.moveTo(x + this.sign * (167.5 + 120), CONST.H_BORDER - 150);
	        this.ctx.lineTo(x + this.sign * (167.5 + 50 + 120), CONST.H_BORDER - 150);
	        this.ctx.lineTo(x + this.sign * (167.5 + 50 + 120), CONST.H_BORDER - (150 + 50));
	        this.ctx.lineTo(x + this.sign * (167.5 + 120), CONST.H_BORDER - (150 + 50));
	        this.ctx.closePath();
	        this.ctx.stroke();

	        this.ctx.strokeText(this.ctrl.right, x + this.sign * (167.5 + 120 + 50 / 2), CONST.H_BORDER - (150 + 50 / 2 - 24 / 4));

	        this.ctx.beginPath();
	        this.ctx.moveTo(x + this.sign * (167.5 + 60), CONST.H_BORDER - (150 + 60));
	        this.ctx.lineTo(x + this.sign * (167.5 + 50 + 60), CONST.H_BORDER - (150 + 60));
	        this.ctx.lineTo(x + this.sign * (167.5 + 50 + 60), CONST.H_BORDER - (150 + 60 + 50));
	        this.ctx.lineTo(x + this.sign * (167.5 + 60), CONST.H_BORDER - (150 + 60 + 50));
	        this.ctx.closePath();
	        this.ctx.stroke();

	        this.ctx.strokeText(this.ctrl.up, x + this.sign * (167.5 + 60 + 50 / 2), CONST.H_BORDER - (150 + 60 + 50 / 2 - 24 / 4));
	    }


	    jump() {
	        this.hideCtrls();
	        if (this.vy != 0) return;

	        this.t0 = Date.now();

	        this.vy = CONST.PLAYER_JUMP_VELOCITY
	    }

	    move() {
	        let t = (Date.now() - this.t0) / CONST.TIME_SCALE;

	        this.x += this.vx;
	        this.y = this.y0 - (this.vy > 0 ? (this.vy * t - 0.5 * CONST.G * Math.pow(t, 2)) : 0);

	        if (this.x - this.r < this.xLeft) this.x = this.xLeft + this.r;
	        if (this.x + this.r > this.xRight) this.x = this.xRight - this.r;

	        if (this.y >= this.y0) {
	            this.vy = 0;
	            this.y = this.y0;
	        }
	    }

	    left() {
	        this.hideCtrls();
	        if (this.x <= this.xLeft + this.r) {
	            this.x = this.xLeft + this.r;
	            return;
	        }
	        this.x -= CONST.PLAYER_STEP;
	    }

	    right() {
	        this.hideCtrls();
	        if (this.x >= this.xRight - this.r) {
	            this.x = this.xRight - this.r;
	            return;
	        }
	        this.x += CONST.PLAYER_STEP;
	    }

	    leftPressed() {
	        this.hideCtrls();
	        this.vx = -CONST.PLAYER_H_VELOCITY;
	    }

	    rightPressed() {
	        this.hideCtrls();
	        this.vx = CONST.PLAYER_H_VELOCITY;
	    }

	    released() {
	        this.vx = 0;
	    }

	    bindKeys() {
	        keyboardJS.bind(this.ctrl.left, this.leftPressed.bind(this), this.released.bind(this));
	        keyboardJS.bind(this.ctrl.right, this.rightPressed.bind(this), this.released.bind(this));
	        keyboardJS.bind(this.ctrl.up, this.jump.bind(this));
	    }
	}

	module.exports = Player;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	const CONST = __webpack_require__(1);

	let Point = __webpack_require__(7);

	class Wave {

	    constructor(ctx, opt) {
	        ctx.lineJoin = 'round';
	        ctx.lineWidth = opt.thickness;
	        ctx.strokeStyle = opt.strokeCol;
	        this.opt = opt;
	        this.init();
	    }

	    updatePoints() {
	        let i = this.points.length;
	        while (i--) {
	            this.points[i].update();
	        }
	    }

	    renderPoints() {
	        let i = this.points.length;
	        while (i--) {
	            this.points[i].render();
	        }
	    }

	    renderShape(ctx) {
	        ctx.lineWidth = this.opt.thickness;
	        ctx.strokeStyle = this.opt.strokeColor;
	        ctx.beginPath();
	        let pointCount = this.points.length;
	        ctx.moveTo(this.points[0].x, this.points[0].y);
	        let i;
	        for (i = 0; i < pointCount - 1; i++) {
	            let c = (this.points[i].x + this.points[i + 1].x) / 2;
	            let d = (this.points[i].y + this.points[i + 1].y) / 2;
	            ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d);
	        }
	        ctx.lineTo(-this.opt.range.x - this.opt.thickness, CONST.H_BORDER + this.opt.thickness);
	        ctx.lineTo(CONST.V_BORDER + this.opt.range.x + this.opt.thickness, CONST.H_BORDER + this.opt.thickness);
	        ctx.closePath();
	        ctx.fillStyle = 'hsl(' + this.opt.color_hsl + ', 70%, 95%)';
	        ctx.fill();
	        ctx.stroke();
	    }

	    init() {
	        this.points = [];
	        let i = this.opt.count + 2;
	        let spacing = (CONST.V_BORDER + (this.opt.range.x * 2)) / (this.opt.count - 1);
	        while (i--) {
	            this.points.push(new Point({
	                x: (spacing * (i - 1)) - this.opt.range.x,
	                y: CONST.H_BORDER - (CONST.H_BORDER * this.opt.level)
	            }, this.opt));
	        }
	    }
	}

	module.exports = Wave;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	var Point = function (config, opt) {
	    this.anchorX = config.x;
	    this.anchorY = config.y;
	    this.x = config.x;
	    this.y = config.y;
	    this.opt = opt;
	    this.setTarget();
	};

	Point.prototype.setTarget = function () {
	    this.initialX = this.x;
	    this.initialY = this.y;
	    this.targetX = this.anchorX + rand(0, this.opt.range.x * 2) - this.opt.range.x;
	    this.targetY = this.anchorY + rand(0, this.opt.range.y * 2) - this.opt.range.y;
	    this.tick = 0;
	    this.duration = rand(this.opt.duration.min, this.opt.duration.max);
	}

	Point.prototype.update = function () {
	    var dx = this.targetX - this.x;
	    var dy = this.targetY - this.y;
	    var dist = Math.sqrt(dx * dx + dy * dy);

	    if (Math.abs(dist) <= 0) {
	        this.setTarget();
	    } else {
	        var t = this.tick;
	        var b = this.initialY;
	        var c = this.targetY - this.initialY;
	        var d = this.duration;
	        this.y = ease(t, b, c, d);

	        b = this.initialX;
	        c = this.targetX - this.initialX;
	        d = this.duration;
	        this.x = ease(t, b, c, d);

	        this.tick++;
	    }
	};

	Point.prototype.render = function (ctx) {
	    ctx.beginPath();
	    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
	    ctx.fillStyle = '#000';
	    ctx.fill();
	};


	let rand = function (min, max) {
	    return Math.floor((Math.random() * (max - min + 1)) + min);
	}
	let ease = function (t, b, c, d) {
	    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
	    return -c / 2 * ((--t) * (t - 2) - 1) + b;
	};

	module.exports = Point;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = Object.freeze({
	    opt1 : {
	    count: 7,
	    range: {
	        x: 20,
	        y: 30
	    },
	    duration: {
	        min: 40,
	        max: 60
	    },
	    thickness: 0.1,
	    strokeColor: '#444',
	    level: .35,
	    curved: true,
	    color_hsl: 180,
	    color: '#F4F6FE'
	}, opt2 :{
	    count: 7,
	    range: {
	        x: 20,
	        y: 30
	    },
	    duration: {
	        min: 40,
	        max: 60
	    },
	    thickness: 0.1,
	    strokeColor: '#444',
	    level: .45,
	    curved: true,
	    color_hsl: 210,
	    color: '#F9FAFF'
	}, opt3 :{
	    count: 7,
	    range: {
	        x: 20,
	        y: 30
	    },
	    duration: {
	        min: 40,
	        max: 60
	    },
	    thickness: 0.1,
	    strokeColor: '#444',
	    level: .55,
	    curved: true,
	    color_hsl: 240,
	    color: '#FDFEFF'
	}
	});



/***/ })
/******/ ]);