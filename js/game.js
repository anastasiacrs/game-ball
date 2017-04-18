 (function() {

        const CONST = require('./const.js');

        const Vector = require('./component/vector.js');
        const Ball = require('./component/ball.js');
        const Net = require('./component/net.js');
        const Player = require('./component/player.js');
        const Wave = require('./background/wave.js');

        const WAVE_CONFIG = require('./background/wave_config.js');

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