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

gulp.task("default", ["watch"]);  // Default Task. | 默认任务.
gulp.task("build", buildFunc);  // Project Building Task. | 构建任务.
gulp.task("watch", buildFunc.bind(null, true));  // Files Watching Task. | 文件改动监视任务.



function buildFunc (watch) {
    var bundler = watchify(
        browserify(appConfig.entry, { debug: true })
            .transform("babelify", { presets: ["es2015"] })
    );
    
    
    if (watch) {
        bundler.on("update", () => {
            bundle();
        });
        
        bundler.on("log", util.log);
    }
    
    function bundle () {
        bundler
            .bundle()
            .on("error", function (err) {
                console.error(err);
                this.emit("end");
            })
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(appConfig.dist));
    }
    
    bundle();
}
