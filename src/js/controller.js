import Drag from "./util/drag";
import Colour from "./util/colour";
import Renderer from "./renderer";
import Pattern from "./core/pattern";
import Shape from "./core/shape";
import Block from "./core/block";
import Random from "random-js";

export default class Controller {

	constructor(game) {
		this.shapes = [];
		this.dragging = null;
		this.game = game;
		this.drag = new Drag();
		this.concurrentShapes = 3;
		this.random = new Random();
		this.drag.candrag = () => {
			return !this.dragging;
		};
		var initialPos = {x: 0, y: 0};
		this.drag.ondragstart = (event) => {
			let shape = null;
			shapes: for(let i = this.shapes.length - 1; i >= 0; i--) {
				let shape2 = this.shapes[i];
				let gridPos = this.game.renderer.getGridPos(this.game.grid);
				let deltaX = event.position.x - gridPos.x - shape2.x;
				let deltaY = event.position.y - gridPos.y - shape2.y;
				for(let block of shape2.blocks) {
					if(!block) continue;
					let offsets = Renderer.BLOCK.getOffsets(block);
					if(deltaX >= offsets.x && deltaX <= offsets.x + Renderer.BLOCK.size && deltaY >= offsets.y && deltaY <= offsets.y + Renderer.BLOCK.size) {
						shape = shape2;
						break shapes;
					}
				}
			}
			if(shape) {
				if(event.doubleClick) {
					shape.rotate(true);
					event.cancelled = true;
					return;
				}
				initialPos.x = shape.x;
				initialPos.y = shape.y;
				this.shapes.splice(this.shapes.indexOf(shape), 1);
				this.shapes.splice(this.shapes.length, 0, shape);
				(this.dragging = shape).dragging = true;
			} else event.cancelled = true;
		};
		this.drag.ondragmove = (x, y) => {
			if(this.dragging) {
				this.dragging.x = initialPos.x + x;
				this.dragging.y = initialPos.y + y;
				this.snap(false);
			}
		};
		this.drag.ondragend = () => {
			this.dragging.dragging = false;
			this.snap(true);
			this.dragging = null;
		};
		this.update();
	}

	update() {
		let array = [];
		let grid = this.game.grid;
		// check y direction
		for(let x = 0; x < grid.width; x++) {
			let temp = [];
			let empty = false;
			for(let y = 0; y < grid.height; y++) {
				let block = grid.get(x, y);
				if(!array.includes(block)) {
					temp.push(block);
				}
				if(block.empty) {
					empty = true;
					break;
				}
			}
			if(!empty) {
				array = array.concat(temp);
			}
		}
		// check x direction
		for(let y = 0; y < grid.height; y++) {
			let temp = [];
			let empty = false;
			for(let x = 0; x < grid.width; x++) {
				let block = grid.get(x, y);
				if(!array.includes(block)) {
					temp.push(block);
				}
				if(block.empty) {
					empty = true;
					break;
				}
			}
			if(!empty) {
				array = array.concat(temp);
			}
		}
		for(let block of array) {
			block.colour = null;
			block.empty = true;
			this.game.score += 10;
		}

		if(this.shapes.length == 0) {
			for(let i = 0; i < this.concurrentShapes; i++) {
				let shape = this.getShape(this.random.pick(Pattern));
				shape.colour = Colour.random(["GREY"]);
				this.shapes.push(shape);
			}
		}
	}

	getShape(pattern) {
		let shape = new Shape(0, 0, pattern.width, pattern.height);
		for(let x = 0; x < pattern.width; x++) {
			for(let y = 0; y < pattern.height; y++) {
				if(pattern.data[x + (y * pattern.width)] === 1) {
					shape.set(x, y, new Block(x, y, null, false));
				}
			}
		}
		return shape;
	}

	snap(place = false) {
		let blockSize = Renderer.BLOCK.size + Renderer.BLOCK.margin;
		let x = Math.round(this.dragging.x / blockSize);
		let y = Math.round(this.dragging.y / blockSize);

		let xDelta = this.dragging.x - (x * blockSize);
		let yDelta = this.dragging.y - (y * blockSize);

		// check if supposed to snap
		if(this.fits(this.dragging, x, y)) {
			if(Math.abs(xDelta) <= Renderer.BLOCK.snap && Math.abs(yDelta) <= Renderer.BLOCK.snap) {
				this.dragging.x -= xDelta;
				this.dragging.y -= yDelta;
				if(place) {
					this.place(this.dragging, x, y);
				}
			}
		}
	}

	fits(shape, x, y) {
		let grid = this.game.grid;
		if(x < 0 || y < 0 || x + (shape.width - 1) >= grid.width || y + (shape.height - 1) >= grid.height) {
			return false;
		}
		for(let block of shape.blocks) {
			if(block) {
				let x2 = block.x + x;
				let y2 = block.y + y;
				let block2 = grid.get(x2, y2);
				if(!block2 || !block2.empty) {
					return false;
				}
			}
		}
		return true;
	}

	place(shape, x, y) {
		if(this.fits(shape, x, y)) {
			for(let block of shape.blocks) {
				if(block) {
					let x2 = block.x + x;
					let y2 = block.y + y;
					let block2 = this.game.grid.get(x2, y2);
					block2.empty = false;
					block2.colour = shape.colour;
				}
			}
			this.shapes.splice(this.shapes.indexOf(shape), 1);
			this.update();
		}
	}

}
