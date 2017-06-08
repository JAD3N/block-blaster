import gulp from "gulp";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import notify from "gulp-notify";
import runSequence from "run-sequence";

const sources = [
	"src/css/**/*.scss"
];

gulp.task("styles", () => {
	return gulp.src(sources)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on("error", notify.onError({title: "styles"}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("./dist/css"));
});

gulp.task("styles:watch", () => {
	return gulp.watch(sources, () => {
		runSequence("styles", "reload");
	});
});
