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

		$("#game").on("mouseup touchend", () => {
			event.preventDefault();
			if(this.dragging) {
				this.dragging = false;
				if(this.ondragend) this.ondragend();
			}
		});

		$("#game").on("mousemove touchmove", (event) => {
			event.preventDefault();
			if(this.dragging) {
				this.position.x = event.pageX;
				this.position.y = event.pageY;
				if(this.ondragmove) this.ondragmove(
					this.position.x - this.pivot.x,
					this.position.y - this.pivot.y);
			}
		});

		$("#game").on("mousedown touchstart", (event) => {
			event.preventDefault();
			if(!this.dragging && this.candrag()) {
				let doubleClick = false;
				let now = Date.now();
				if(this.lastDrag && now - this.lastDrag <= 300) {
					doubleClick = true;
					this.lastDrag = null;
				} else {
					this.lastDrag = now;
				}
				let event2 = {
					position: {
						x: event.pageX,
						y: event.pageY
					},
					doubleClick: doubleClick,
					originalEvent: event,
					cancelled: false
				};
				if(this.ondragstart) {
					this.ondragstart(event2);
				}
				if(!event2.cancelled) {
					this.dragging = true;
					this.pivot.x = event.pageX;
					this.pivot.y = event.pageY;
				}
			}
		});
	}

}
