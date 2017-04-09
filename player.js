class Player {

//pl1: xLeft:0, xRight:500
//pl1: xLeft:510, xRight:1010
    constructor(x, y, r, _left, _right, _up, xLeft, xRight, color, side) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.xLeft=xLeft;
        this.xRight=xRight;

        this.color=color;

        this.v = 0;
        this.y0 = y;
        this.t0 = 0;

        this.side=side;

        this.ctrl = {
            left: _left,
            right: _right,
            up: _up
        }

        this.bindKeys();
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.r, Math.PI, 0, false);
        context.fillStyle = this.color;
        context.fill();
        //eye
        context.beginPath();
        let sign=this.side=='left'?-1:1;
        context.arc(this.x-sign*(this.r/2-3), this.y-this.r/2+3, this.r/3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();
        context.beginPath();
        context.arc(this.x-sign*(this.r/2), this.y-this.r/2, this.r/8, 0, 2 * Math.PI, false);
        context.fillStyle = 'black';
        context.fill();
    }

    jump() {
        if (this.v != 0) return;

        this.t0 = Date.now();

        this.v = PLAYER_JUMP_VELOCITY;
    }

    move() {
        if (this.v == 0) return;

        let t = (Date.now() - this.t0) / TIME_SCALE;

        this.y = this.y0 - (this.v * t - 0.5 * G * Math.pow(t, 2));

        if (this.y > this.y0) {
            this.v = 0;
        }

    }

    left() {
        console.log('left');
        if(this.x<=this.xLeft+this.r){this.x=this.xLeft+this.r; return;}
        this.x -= PLAYER_STEP;
    }

    right() {
         if(this.x>=this.xRight-this.r){this.x=this.xRight-this.r; return;}
        this.x += PLAYER_STEP;
    }


    bindKeys() {
        keyboardJS.bind(this.ctrl.left, this.left.bind(this));
        keyboardJS.bind(this.ctrl.right, this.right.bind(this));
        keyboardJS.bind(this.ctrl.up, this.jump.bind(this));
    }


}