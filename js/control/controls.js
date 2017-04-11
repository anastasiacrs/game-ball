class Controls {
	constructor(player) {
		this.ctrl=player.ctrl;
		this.side=player.side;
		this.sign=this.side=='left'?1:-1;
		this.color=player.color;
	}
	//V_BORDER; width
    //H_BORDER; height
/*
   50 10 50 10 50
         170
         505     505
  167.5 170 167.5     210 85 210
  ==============
50
10
50
 150 
*/
	draw(ctx) {
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
}