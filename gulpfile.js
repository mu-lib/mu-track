var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("default", function() {
  return gulp.src([
    "node_modules/mu-afq/afq.js",
    "./filter.js",
    "./forward.js",
    "./handler.js",
    "./reduce.js"
  ])
    .pipe(concat("analytics.js"))
    .pipe(gulp.dest("./dist/"));
});
