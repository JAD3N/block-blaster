import Grid from "./grid";

export default class Shape extends Grid {

	constructor(x, y, width, height, colour) {
		super(width, height);
		this.x = x;
		this.y = y;
		this.colour = colour;
		this.dragging = false;
	}

	rotate(cw) {
		let width = this.width;
		let height = this.height;
		let blocks = new Array(height * width);
		for(let x = 0; x < width; x++) {
			for(let y = 0; y < height; y++) {
				let x2 = cw ? y : height - 1 - y;
				let y2 = cw ? width - 1 - x : x;

				let block = this.get(x, y);
				if(block) {
					block.x = x2;
					block.y = y2;
				}
				blocks[x2 + (y2 * height)] = block;
			}
		}
		this.width = height;
		this.height = width;
		this.blocks = blocks;
	}

}
