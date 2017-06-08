import gulp from "gulp";
import browserify from "browserify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sourcemaps from "gulp-sourcemaps";
import notify from "gulp-notify";
import runSequence from "run-sequence";

const entry = "src/js/block-blaster.js";
const sources = [
	"src/js/**/*.js"
];

gulp.task("scripts", () => {
	return browserify(entry, {debug: true, extensions: ["es6"]})
		.transform("babelify", {presets: ["es2015", "stage-2"]})
		.bundle()
		.pipe(source("bundle.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.on("error", notify.onError({title: "scripts"}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("./dist/js"));
});

gulp.task("scripts:watch", () => {
	return gulp.watch(sources, () => {
		runSequence("scripts", "reload");
	});
});
