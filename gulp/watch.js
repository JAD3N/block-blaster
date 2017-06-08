import gulp from "gulp";

gulp.task("watch", [
	"eslint:watch",
	"scripts:watch",
	"styles:watch",
	"view"
]);
