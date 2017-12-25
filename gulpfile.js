// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const nodemon = require('gulp-nodemon');

// Lint Task
gulp.task('lint1', function() {
    return gulp.src('./public/home/js/*.js')
        .pipe(
            jshint({
                esversion: 6
            })
        )
        .pipe(jshint.reporter('default'));
});
gulp.task('lint2', function() {
    return gulp.src('./public/game/js/*.js')
        .pipe(
            jshint({
                esversion: 6
            })
         )
        .pipe(jshint.reporter('default'));
});
gulp.task('lint', ['lint1', 'lint2']);

// Compile Our Sass
gulp.task('sass1', function() {
    return gulp.src('./public/home/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/home/css'));
});
gulp.task('sass2', function() {
    return gulp.src('./public/game/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/game/css'));
});
gulp.task('sass', ['sass1', 'sass2']);

// Nodemon for Live Reload
gulp.task('develop', function(){
    var stream = nodemon({ 
		script: 'app.js',
		ext: 'html js',
        //ignore: ['ignored.js'],
        tasks: ['lint'] 
	});

    stream.on('restart', function(){
        console.log('restarted!')
    }).on('crash', function(){
        console.error('Application has crashed!\n')
        stream.emit('restart', 10)  // restart the server in 10 seconds
    });
});


// Concatenate & Minify JS
/*gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});*/

// Watch Files For Changes
/*gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});*/

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['lint', 'sass', 'develop']);
