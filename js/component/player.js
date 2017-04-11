class Player {

    //include controls.js

//pl1: xLeft:0, xRight:500
//pl1: xLeft:510, xRight:1010
    constructor(x, y, r, _left, _right, _up, xLeft, xRight, color, side) {
        this.x = x;
        this.y = y;
        this.r = r;

        this.xLeft=xLeft;
        this.xRight=xRight;

        this.color=color;
        
        this.vx = 0;
        this.vy = 0;
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

        this.isCtrls=true;

        this.score=0;


        this.sign=this.side=='left'?1:-1;
    }

    win(){
        console.log('win');
        this.score++;
    }

    hideCtrls(){
        this.isCtrls=false;
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

        this.drawScore(context);
        if(this.isCtrls){
            this.drawCtrls(context);
        }
    }

    drawScore(ctx){
        ctx.beginPath();
        ctx.font = '128px serif';
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        let x = this.side=='left'?0:V_BORDER;
        ctx.fillText(this.score, x+this.sign*100,150);
    }

    drawCtrls(ctx) {
        //w=50, gap=10
        //167.5=(V_BORDER/2-w*3-gap*2)/2
        ctx.font = '24px serif';
        ctx.textAlign = "center";


        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;

        let x = this.side=='left'?0:V_BORDER;

        ctx.beginPath();
        ctx.moveTo(x+this.sign*167.5,H_BORDER-150);
        ctx.lineTo(x+this.sign*(167.5+50), H_BORDER-150);
        ctx.lineTo(x+this.sign*(167.5+50), H_BORDER-(150+50));
        ctx.lineTo(x+this.sign*167.5, H_BORDER-(150+50));
        ctx.closePath();
        ctx.stroke();

        ctx.strokeText(this.ctrl.left, x+this.sign*(167.5+50/2), H_BORDER-(150+50/2-24/4));

        ctx.beginPath();
        ctx.moveTo(x+this.sign*(167.5+120),H_BORDER-150);
        ctx.lineTo(x+this.sign*(167.5+50+120), H_BORDER-150);
        ctx.lineTo(x+this.sign*(167.5+50+120), H_BORDER-(150+50));
        ctx.lineTo(x+this.sign*(167.5+120), H_BORDER-(150+50));
        ctx.closePath();
        ctx.stroke();

        ctx.strokeText(this.ctrl.right, x+this.sign*(167.5+120+50/2), H_BORDER-(150+50/2-24/4));

        ctx.beginPath();
        ctx.moveTo(x+this.sign*(167.5+60),H_BORDER-(150+60));
        ctx.lineTo(x+this.sign*(167.5+50+60), H_BORDER-(150+60));
        ctx.lineTo(x+this.sign*(167.5+50+60), H_BORDER-(150+60+50));
        ctx.lineTo(x+this.sign*(167.5+60), H_BORDER-(150+60+50));
        ctx.closePath();
        ctx.stroke();

        ctx.strokeText(this.ctrl.up, x+this.sign*(167.5+60+50/2), H_BORDER-(150+60+50/2-24/4));
    }



    jump() {
        this.hideCtrls();
        if (this.vy != 0) return;

        this.t0 = Date.now();

        this.vy = PLAYER_JUMP_VELOCITY
    }

    move() {
        let t = (Date.now() - this.t0) / TIME_SCALE;

        this.x += this.vx;
        this.y = this.y0 - (this.vy > 0 ? (this.vy * t - 0.5 * G * Math.pow(t, 2)) : 0);

        if (this.x - this.r < this.xLeft) this.x = this.xLeft + this.r;
        if (this.x + this.r > this.xRight) this.x = this.xRight - this.r;

        if (this.y >= this.y0) {
            this.vy = 0;
            this.y = this.y0;
        }
    }

    left() {
        this.hideCtrls();
        if(this.x<=this.xLeft+this.r){this.x=this.xLeft+this.r; return;}
        this.x -= PLAYER_STEP;
    }

    right() {
        this.hideCtrls();
         if(this.x>=this.xRight-this.r){this.x=this.xRight-this.r; return;}
        this.x += PLAYER_STEP;
    }

    leftPressed() {
        this.vx = -PLAYER_H_VELOCITY;
    }

    rightPressed() {
        this.vx = PLAYER_H_VELOCITY;
    }

    released() {
        this.vx = 0;
    }


    bindKeys() {
        // keyboardJS.bind(this.ctrl.left, this.left.bind(this));
        // keyboardJS.bind(this.ctrl.right, this.right.bind(this));

        keyboardJS.bind(this.ctrl.left, this.leftPressed.bind(this), this.released.bind(this));
        keyboardJS.bind(this.ctrl.right, this.rightPressed.bind(this), this.released.bind(this));

        keyboardJS.bind(this.ctrl.up, this.jump.bind(this));
    }


}