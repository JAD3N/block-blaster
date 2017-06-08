export default class MathHelper {

	static rotatePoint(x, y, cx, cy, angle) {
		let theta = (Math.PI / 180) * angle;
		let cos = Math.cos(theta);
		let sin = Math.sin(theta);
		return {
			x: cx + (cos * (x - cx) + sin * (y - cy)),
			y: cy + (-sin * (x - cx) + cos * (y - cy))
		};
	}

	static rotateSize(width, height, angle) {
		let theta = (Math.PI / 180) * angle;
		let cos = Math.cos(theta);
		let sin = Math.sin(theta);
		return {
			width: Math.abs(width * cos) + Math.abs(height * sin),
			height: Math.abs(width * sin) + Math.abs(height * cos)
		};
	}

}
