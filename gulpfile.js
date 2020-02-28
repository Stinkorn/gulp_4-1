let gulp       = require('gulp'),
	scss         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'),
	cssnano      = require('gulp-cssnano'),
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
	cache        = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', async function() {
	return del.sync('dist');
});

gulp.task('scss', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(scss({outputStyle: 'compressed'}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	});
});

gulp.task('script', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(concat('script.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', function(){
	return gulp.src('src/js/libs/*.js')
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('code', function() {
	return gulp.src('src/*.html')
	.pipe(browserSync.reload({ stream: true }))
});



gulp.task('img', function() {
	return gulp.src('src/img/**/*')
		.pipe(cache(imagemin({
		// .pipe(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('prebuild', async function() {

	let buildCss = gulp.src(['src/css/main.min.css'])
	.pipe(gulp.dest('dist/css'))

	let buildFonts = gulp.src('src/fonts/**/*.*')
	.pipe(gulp.dest('dist/fonts'))

	let buildJs = gulp.src(['src/js/script.min.js', 'src/js/libs.min.js'])
	.pipe(gulp.dest('dist/js'))

	let buildHtml = gulp.src('src/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', gulp.parallel('scss'));
	gulp.watch('src/*.html', gulp.parallel('code'));
	gulp.watch(['src/js/script.js', 'src/libs/**/*.js'], gulp.parallel('script'));
});
gulp.task('default', gulp.parallel('scss', 'script', 'js', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'scss', 'script', 'js'));