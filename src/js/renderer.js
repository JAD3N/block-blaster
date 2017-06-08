import Colour from "./util/colour";

class Renderer {

	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
	}

	draw(grid, shapes, score, highScore) {
		this.clear();
		this.drawGrid(grid);
		// iterate shapes backwards
		for(let i = 0; i < shapes.length; i++) {
			this.drawShape(grid, shapes[i]);
		}
		this.drawScores(grid, score, highScore);
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "#3A342F";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawScores(grid, score, highScore) {
		this.ctx.font = "40px Open Sans";
		this.ctx.fillStyle = "#FFFFFF";

		let pos = this.getGridPos(grid);

		this.ctx.textAlign = "left";
		this.ctx.fillText(score, pos.x + 10, pos.y - 20);

		this.ctx.textAlign = "right";
		this.ctx.fillText(highScore, pos.x + pos.width - 10, pos.y - 20);
	}

	drawShape(grid, shape) {
		let pos = this.getGridPos(grid);
		let x = pos.x;
		let y = pos.y;
		for(let x2 = 0; x2 < shape.width; x2++) {
			for(let y2 = 0; y2 < shape.height; y2++) {
				let block = shape.get(x2, y2);
				if(block) {
					let offsets = Renderer.BLOCK.getOffsets(block);
					this.drawBlock(block, offsets.x + shape.x + x, offsets.y + shape.y + y, shape.colour, shape.dragging);
				}
			}
		}
	}

	getGridPos(grid) {
		let gridSize = grid.screenSize;
		let x = (this.canvas.width - gridSize.width) / 2;
		let y = (this.canvas.height - gridSize.height) / 2;
		return {
			x: x,
			y: y,
			width: gridSize.width,
			height: gridSize.height
		};
	}

	drawGrid(grid) {
		let pos = this.getGridPos(grid);
		let x = pos.x;
		let y = pos.y;
		for(let x2 = 0; x2 < grid.width; x2++) {
			for(let y2 = 0; y2 < grid.height; y2++) {
				let block = grid.get(x2, y2);
				if(block) {
					let offsets = Renderer.BLOCK.getOffsets(block);
					this.drawBlock(block, offsets.x + x, offsets.y + y);
				}
			}
		}
	}

	drawBlock(block, x, y, colour, dragging = false) {
		function roundRect(ctx, x, y, width, height, radius) {
			let r2d = Math.PI / 180;
			let x2 = x + width;
			let y2 = y + height;
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x2 - radius, y);
			ctx.arc(x2 - radius, y + radius, radius, r2d * 270, r2d * 360, false);
			ctx.lineTo(x2, y2 - radius);
			ctx.arc(x2 - radius, y2 - radius, radius, r2d * 0, r2d * 90, false);
			ctx.lineTo(x + radius, y2);
			ctx.arc(x + radius, y2 - radius, radius, r2d * 90, r2d * 180, false);
			ctx.lineTo(x, y + radius);
			ctx.arc(x + radius, y + radius, radius, r2d * 180, r2d * 270, false);
			ctx.closePath();
		}

		let blockColour = colour || (block.empty ? Colour.GREY : block.colour);
		let blockSize = block.empty ? Renderer.BLOCK.emptySize : Renderer.BLOCK.size;

		if(!dragging) {
			this.ctx.save();
			this.ctx.globalAlpha = 0.4;
			this.ctx.fillStyle = blockColour.dark;
			roundRect(this.ctx, x + Renderer.BLOCK.shadow, y + Renderer.BLOCK.shadow, blockSize, blockSize, Renderer.BLOCK.radius);
			this.ctx.fill();
			this.ctx.restore();
		}

		this.ctx.save();
		this.ctx.globalAlpha = dragging ? 0.4 : 1;
		this.ctx.fillStyle = blockColour.light;
		roundRect(this.ctx, x, y, blockSize, blockSize, Renderer.BLOCK.radius);
		this.ctx.fill();
		this.ctx.restore();
		if(dragging) {
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = blockColour.light;
			this.ctx.stroke();
		}
	}
}

Renderer.BLOCK = {
	size: 32,
	emptySize: 24,
	margin: 8,
	shadow: 4,
	radius: 4,
	snap: 8,

	getOffsets: function(block) {
		let emptyOff = block.empty ? (this.size - this.emptySize) / 2 : 0;
		let x = (block.x * this.size) + (block.x * this.margin) + emptyOff;
		let y = (block.y * this.size) + (block.y * this.margin) + emptyOff;
		return {x: x, y: y};
	}
};

export default Renderer;
