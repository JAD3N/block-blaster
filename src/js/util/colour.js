import Random from "random-js";

const VALUES = {};
const RANDOM = new Random();

class Colour {
	constructor(name, light, dark) {
		this.name = name;
		this.light = light;
		this.dark = dark;
		VALUES[name] = this;
	}

	static random(ignore = []) {
		let colours = [];
		for(let colour in VALUES) {
			if(ignore.includes(colour)) {
				continue;
			}
			colours.push(VALUES[colour]);
		}
		return RANDOM.pick(colours);
	}
}

Colour.GREY = new Colour("GREY", "#4E463F", "#2D2926");
Colour.RED = new Colour("RED", "#A22929", "#7B1E1E");
Colour.RED2 = new Colour("RED2", "#E3295E", "#7a1f57");
Colour.PINK = new Colour("PINK", "#A22974", "#7A1F57");
Colour.PINK2 = new Colour("PINK2", "#7D26EF", "#5E1DBA");
Colour.PURPLE = new Colour("PURPLE", "#531880", "#391058");
Colour.BLUE = new Colour("BLUE", "#27409C", "#1D3179");
Colour.BLUE2 = new Colour("BLUE2", "#3873E0", "#2754A3");
Colour.GREEN = new Colour("GREEN", "#2ACC38", "#1C9626");
Colour.GREEN2 = new Colour("GREEN2", "#1E7D29", "#18561F");
Colour.LEAF = new Colour("LEAF", "#6A792C", "#576325");
Colour.YELLOW = new Colour("YELLOW", "#D2B732", "#AF992B");
Colour.ORANGE = new Colour("ORANGE", "#D06C18", "#Ab5A15");
Colour.GOLD = new Colour("GOLD", "#F6B62C", "#F7981B");

export default Colour;
