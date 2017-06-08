import gulp from "gulp";
import runSequence from "run-sequence";

gulp.task("build", callback => {
	return runSequence.use(gulp)(
		"clean",
		[
			"scripts",
			"styles"
		],
		callback
	);
});
