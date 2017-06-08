export default {

	level: 3,

	info: function(str) {
		if(this.level > -1) {
			console.info("%c[INFO]", "color:blue", str);
		}
	},

	warn: function(str) {
		if(this.level > 0) {
			console.warn("[WARN]", str);
		}
	},

	error: function(str) {
		if(this.level > 1) {
			console.info("%c[ERROR]", "color:red", str);
		}
	},

	debug: function(str) {
		if(this.level > 2) {
			console.info("%c[DEBUG]", "color:orange", str);
		}
	}

};
