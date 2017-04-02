gulp = require('gulp');
ts = require('gulp-typescript');
babel = require('gulp-babel');
eslint = require('gulp-eslint');
minify = require('gulp-minify');

gulp.task('ts', function() {
  return gulp.src('src/index.ts')
    .pipe(ts({
      target: 'es6',
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('babel', ['ts'], function() {
  return gulp.src('src/index.js')
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('minify', ['ts', 'babel'], function() {
  gulp.src('build/index.js')
    .pipe(minify({
      ext: {
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  gulp.watch('src/index.ts', ['ts', 'babel', 'minify']);
});

gulp.task('default', ['ts', 'babel', 'minify']);
