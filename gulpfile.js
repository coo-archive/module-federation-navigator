"use strict";

let gulp = require('gulp');

gulp.task('definitions:publication:navigator', done => {
	gulp.src([
		'./projects/ngcx-module-federation-navigator/src/lib/*.d.ts',
	]).pipe(
		gulp.dest('dist/ngcx/module-federation-navigator/lib/')
	)
	done();
});

gulp.task('definitions:publication:routine', done => {
	gulp.src([
		'./projects/ngcx-routine/src/lib/*.d.ts',
	]).pipe(
		gulp.dest('dist/ngcx/routine/lib/')
	)
	done();
});