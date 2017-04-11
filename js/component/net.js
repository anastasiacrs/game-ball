class Net {

    constructor(x, height, width, color) {
        this.x = x;
        this.height = height;
        this.width = width;
        this.color = color;

        this.top = {x: x, y: H_BORDER - this.height, r: NET_RADIUS };
        this.left = x - NET_RADIUS;
        this.right = x + NET_RADIUS;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x - this.width / 2, H_BORDER);
        ctx.lineTo(this.x - this.width / 2, H_BORDER - this.height);
        ctx.arc(this.x, H_BORDER - this.height, this.width / 2, Math.PI, 0, false);
        ctx.lineTo(this.x + this.width / 2, H_BORDER);
        ctx.fillStyle = this.color;
        ctx.fill();

    }

}