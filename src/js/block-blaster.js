import Log from "./util/log";
import Grid from "./core/grid";
import Renderer from "./renderer";
import Controller from "./controller";

class BlockBlaster {

	constructor(parameters) {
		this.parameters = parameters;
		this.canvas = document.getElementById(this.parameters.canvas);
		this.renderer = new Renderer(this.canvas);

		this.grid = new Grid(10, 10);
		this.grid.fill();

		this.controller = new Controller(this);

		this._score = 0;
		this._highscore = 0;

		Log.info("BlockBlaster initialized");
		this.draw();
	}

	get score() {
		return this._score;
	}

	set score(score) {
		this._score = score;
		if(score > this._highscore) {
			this.highscore = score;
		}
	}

	get highscore() {
		return this._highscore;
	}

	set highscore(highscore) {
		this._highscore = highscore;
	}

	draw() {
		this.renderer.draw(this.grid, this.controller.shapes, this.score);
		global.requestAnimationFrame(() => {
			this.draw();
		});
	}

}

global.BlockBlaster = BlockBlaster;

export default BlockBlaster;
