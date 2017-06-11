import Drag from "./util/drag";
import Colour from "./util/colour";
import Renderer from "./renderer";
import Pattern from "./core/pattern";
import Shape from "./core/shape";
import Block from "./core/block";
import Random from "random-js";
import $ from "jquery";

export default class Controller {

	constructor(game) {
		this.shapes = [];
		this.dragging = null;
		this.game = game;
		this.drag = new Drag(this.game.canvas.id);
		this.concurrentShapes = 3;
		this.random = new Random();
		this.drag.candrag = () => {
			return !this.dragging;
		};
		var initialPos = {x: 0, y: 0};
		this.drag.ondragstart = (event) => {
			let shape = null;
			let canvas = this.game.canvas;
			shapes: for(let i = this.shapes.length - 1; i >= 0; i--) {
				let shape2 = this.shapes[i];
				let deltaX = event.position.x - (canvas.width / 2) - shape2.x;
				let deltaY = event.position.y - (canvas.height / 2) - shape2.y;
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
		$(window).on("keydown", (event) => {
			if(event.keyCode === 32) {
				this.dragging && this.dragging.rotate(true);
			}
		});
		this.update();
	}

	update() {
		let array = [];
		let grid = this.game.grid;
		let canvas = this.game.canvas;
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
			let totalWidth = 0;
			for(let i = 0; i < this.concurrentShapes; i++) {
				let shape = this.getShape(this.random.pick(Pattern));
				shape.colour = Colour.random(["GREY"]);

				let size = shape.screenSize;
				totalWidth += size.width;
				shape.y = -size.height / 2;
				this.shapes.push(shape);
			}
			let screenWidth = canvas.width * 0.6;
			let gridPos = this.game.renderer.getGridPos(grid);
			let bottom = gridPos.y + gridPos.height;
			if(screenWidth < gridPos.width) {
				screenWidth = gridPos.width;
			}
			let gapX = (screenWidth - totalWidth) / (this.shapes.length + 1);
			let gapY = canvas.height - bottom;
			for(let i = 0, x = gapX; i < this.shapes.length; i++) {
				let shape = this.shapes[i];
				let size = shape.screenSize;
				shape.x = x - (screenWidth / 2);
				shape.y = ((gapY - size.height) / 2) + bottom - (canvas.height / 2);
				x += gapX + size.width;
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
		let canvas = this.game.canvas;
		let gridPos = this.game.renderer.getGridPos(this.game.grid);
		let a = (canvas.width / 2) - gridPos.x;
		let b = (canvas.height / 2) - gridPos.y;

		let blockSize = Renderer.BLOCK.size + Renderer.BLOCK.margin;
		let x = Math.round((this.dragging.x + a) / blockSize);
		let y = Math.round((this.dragging.y + b) / blockSize);

		let xDelta = (this.dragging.x + a) - (x * blockSize);
		let yDelta = (this.dragging.y + b) - (y * blockSize);

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
