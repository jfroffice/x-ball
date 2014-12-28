var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    wrap = require('gulp-wrap-umd'),
    pkg = require('./package.json'),
    stylish = require('jshint-stylish'),
    path = pkg.path,
    port = 3000;

gulp.task('js', function() {
    return gulp.src('./js/*.js')
        .pipe($.connect.reload())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('sass', function() {
  gulp.src('./css/src/*.scss')
    .pipe($.sass())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./css'))
    .pipe($.connect.reload());
});

gulp.task('connect', function() {
    $.connect.server({
        root: require('path').resolve('./'),
        port: port,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('./*.html')
        .pipe($.connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['html']);
    gulp.watch(['./js/*.js'], ['js']);
    gulp.watch(['./css/**/*.scss'], ['sass']);
});

gulp.task('default', ['connect', 'watch']);

/* build tasks */

var rimraf = require('rimraf');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('clean', function(cb){
    rimraf('./dist', cb);
});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe($.bump())
  .pipe(gulp.dest('./'));
});

gulp.task('concat', function() {
    gulp.src(path.js)
        .pipe($.concat(pkg.name))
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('dist'));
});

gulp.task('bower', function() {
    gulp.src('./bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', function() {
    gulp.src(['dist/' + pkg.name])
        .pipe($.uglify())
        .pipe($.header(banner, { pkg : pkg } ))
        .pipe($.rename(function (path) {
            if(path.extname === '.js') {
                path.basename += '.min';
            }
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('build', ['clean', 'concat', 'bower', 'uglify']);
gulp.task('release', ['bump', 'build', 'build']);
