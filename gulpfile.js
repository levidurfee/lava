const gulp = require("gulp");
const ts = require("gulp-typescript");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const tsProject = ts.createProject("tsconfig.json");
const eslint = require('gulp-eslint');

gulp.task("compile", function () {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("src"));
});

gulp.task('babel', () => {
  return gulp.src('src/index.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('src/es2015'));
});

gulp.task('build', function() {
  return tsProject.src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("src"))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(eslint({
      extends: "google",
      fix: true
    }))
    .pipe(eslint.format())
    .pipe(gulp.dest('src/es2015'));
});

gulp.task('default', function() {
  gulp.watch('src/index.ts', ['build']);
});
