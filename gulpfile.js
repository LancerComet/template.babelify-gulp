/*
 *  Babelify-gulp-starter By LancerComet at 22:14, 2016.05.28.
 *  # Carry Your World # 
 *  ---
 *  Gulpfile.
 */

const gulp = require("gulp");
const util = require("gulp-util");
const rename = require("gulp-rename");

const browserify = require("browserify");
const sourcemaps = require("gulp-sourcemaps");
const watchify = require("watchify");

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

// App Configuration. | 构建设置.
const appConfig = {
    entry: "./src/app.js",
    dist: "./dist"
};

gulp.task("default", ["js-build"]);  // Default Task. | 默认任务.

(function jsTasks () {
    
    var bundler = watchify(
        browserify(appConfig.entry, { debug: true })
            .transform("babelify", { presets: ["es2015"] })
    );
    
    bundler.on("update", bundle);
    bundler.on("log", util.log);
    
    gulp.task("js-build", build);  // Project Building Task. | 构建任务.
    
    function bundle () {
        return bundler
            .bundle()
            .on("error", function (err) {
                console.error(err.toString());
                this.emit("end");
            })
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(appConfig.dist));
    }
    
})();