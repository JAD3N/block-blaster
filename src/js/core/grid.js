import Block from "./block";
import Renderer from "../renderer";

export default class Grid {

	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.blocks = new Array(width * height);
	}

	fill() {
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				this.blocks[x + (y * this.width)] = new Block(x, y);
			}
		}
	}

	get(x, y) {
		return this.blocks[x + (y * this.width)];
	}

	set(x, y, block) {
		this.blocks[x + (y * this.width)] = block;
	}

	get screenSize() {
		return {
			width: (this.width * Renderer.BLOCK.size) + ((this.width - 1) * Renderer.BLOCK.margin),
			height: (this.height * Renderer.BLOCK.size) + ((this.height - 1) * Renderer.BLOCK.margin)
		};
	}

}
