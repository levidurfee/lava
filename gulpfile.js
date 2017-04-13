gulp = require('gulp');
babel = require('gulp-babel');
eslint = require('gulp-eslint');
minify = require('gulp-minify');

gulp.task('babel', function() {
  return gulp.src('src/index.js')
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('minify', ['babel'], function() {
  gulp.src('build/index.js')
    .pipe(minify({
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('src/index.js', ['babel', 'minify']);
});

gulp.task('default', ['babel', 'minify']);
