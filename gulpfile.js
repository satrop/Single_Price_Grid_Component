const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

// SCSS Task
function scssTask() {
	return src('./src/scss/styles.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([cssnano]))
		.pipe(dest('build/css', { sourcemaps: '.' }));
}

// JS Task
// function jsTask() {
// 	return src('src/js/**/*.js')
// 		.pipe(concat('scripts.js'))
// 		.pipe(dest('build/js', { sourcemaps: '.' }));
// }

// HTML Task
function htmlTask() {
	return src('src/**/*.html').pipe(dest('build'));
}

// Image Task
function imgTask() {
	return src('src/img/*').pipe(dest('build/img'));
}

// Browsersync Task
function browserSyncServe(cb) {
	browserSync.init({
		server: {
			baseDir: 'build/',
		},
	});
	cb();
}

function browserSyncReload(cb) {
	browserSync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('**/*.html', browserSyncReload);
	watch(
		['src/scss/**/*.scss', 'src/js/**/*.js', 'src/**/*.html', 'src/img/*'],
		series(scssTask, htmlTask, browserSyncReload, imgTask)
	);
}

// Default Gulp Task
exports.default = series(
	scssTask,
	htmlTask,
	imgTask,
	browserSyncServe,
	watchTask
);
