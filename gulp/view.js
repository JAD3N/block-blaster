import gulp from "gulp";

const browserSync = require("browser-sync").create();

gulp.task("view", () => {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task("reload", () => {
	browserSync.reload();
});
