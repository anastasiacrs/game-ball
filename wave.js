class Wave {

  constructor(ctx, opt) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = opt.thickness;
    ctx.strokeStyle = opt.strokeCol;

    this.opt=opt;

    this.init();
  }

  updatePoints() {
    var i = this.points.length;
    while (i--) {
      this.points[i].update();
    }
  }

  renderPoints() {
    var i = this.points.length;
    while (i--) {
      this.points[i].render();
    }
  }

  renderShape(ctx) {
    ctx.lineWidth = this.opt.thickness;
    ctx.strokeStyle = this.opt.strokeColor;
    ctx.beginPath();
    var pointCount = this.points.length;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    var i;
    for (i = 0; i < pointCount - 1; i++) {
      var c = (this.points[i].x + this.points[i + 1].x) / 2;
      var d = (this.points[i].y + this.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d);
    }
    ctx.lineTo(-this.opt.range.x - this.opt.thickness, H_BORDER + this.opt.thickness);
    ctx.lineTo(V_BORDER + this.opt.range.x + this.opt.thickness, H_BORDER + this.opt.thickness);
    ctx.closePath();
    //180-240
    ctx.fillStyle = 'hsl('+this.opt.color_hsl+', 70%, 95%)';
    //ctx.fillStyle=this.opt.color;
    ctx.fill();
    ctx.stroke();
  }


  init() {
    this.points = [];
    var i = this.opt.count + 2;
    var spacing = (V_BORDER + (this.opt.range.x * 2)) / (this.opt.count - 1);
    while (i--) {
      this.points.push(new Point({
        x: (spacing * (i - 1)) - this.opt.range.x,
        y: H_BORDER - (H_BORDER * this.opt.level)
      }, this.opt));
    }
  }
}