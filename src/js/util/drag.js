import $ from "jquery";

export default class Drag {

	constructor() {
		this.dragging = false;
		this.position = {x: 0, y: 0};
		this.pivot = {x: 0, y: 0};
		this.velocity = {x: 0, y: 0};
		this.lastDrag = null;
		this.ondragend = null;
		this.ondragmove = null;
		this.ondragstart = null;


		this.candrag = () => {
			return true;
		};

		$(document).on("mouseup", () => {
			if(this.dragging) {
				event.preventDefault();
				this.dragging = false;
				if(this.ondragend) this.ondragend();
			}
		});

		$(document).on("mousemove", (event) => {
			if(this.dragging) {
				event.preventDefault();
				this.position.x = event.pageX;
				this.position.y = event.pageY;
				if(this.ondragmove) this.ondragmove(
					this.position.x - this.pivot.x,
					this.position.y - this.pivot.y);
			}
		});

		$(document).on("mousedown", (event) => {
			if(!this.dragging && this.candrag()) {
				event.preventDefault();
				if(this.ondragstart) {
					let event2 = {
						position: {
							x: event.pageX,
							y: event.pageY
						},
						cancelled: false
					};
					this.ondragstart(event2);
					if(!event2.cancelled) {
						this.dragging = true;
						this.pivot.x = event.pageX;
						this.pivot.y = event.pageY;
					}
				}
			}
		});
	}

}
