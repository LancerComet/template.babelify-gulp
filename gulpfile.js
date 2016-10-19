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
const cssify = require("cssify");
const envify = require("envify/custom");
const jadeify = require("jadeify");
const sourcemaps = require("gulp-sourcemaps");
const stylify = require("stylify");
const watchify = require("watchify");

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

/**
 * App Configuration
 * @type { Object }
 */
const appConfig = {
    entry: ["./src/app.js"],
    dist: "./dist",
};

/**
 * Babel Configuration.
 * @type { Object }
 */
const babelConfig = { 
    presets: ["es2015", "stage-2"]
};

/**
 * Default Task Setup.
 */
gulp.task("default", ["js:dev"]);

/**
 * JS Tasks Configuration.
 * All tasks deal with javascript will be set in here.
 */
(function jsTasks () {

    /**
     * Task for development. It will watch whole project and keep bundling.
     */
    gulp.task("js:dev", function () {
        const bundler = createBundler({
            isDebug: true,
            isWatchify: true,
            envs: { NODE_ENV: 'development' }
        });

        bundler
            .on("update", buildExec.bind(null, bundler))
            .on("log", util.log)
            .on("error", function (err) {
                console.error(err.toString());
                this.emit("end");
            });

        return buildExec(bundler);
    });

    /**
     * Task for bundle only. It will exit when bundling finished.
     */
    gulp.task('js:build', function () {
        const bundler = createBundler({ 
            isDebug: false,
            envs: { NODE_ENV: 'production' }
        });

        bundler
            .on("log", util.log)
            .on("error", function (err) {
                console.error(err.toString());
                this.emit("end");
            });

        return buildExec(bundler, true);
    });

    /**
     * Building Function.
     */
    function buildExec (bundler, uglify = false) {
        if (uglify) {
            bundler = bundler.plugin("minifyify", {
                map: false,
                uglify: {
                    compress: {
                        drop_console: true,
                        dead_code: true,
                        conditionals: true,
                        unused: true,
                        if_return: true,
                        global_defs: {
                            DEBUG: false
                        }
                    },
                    mangle: true
                }
            })
        }

        return bundler
            .bundle(function () {})
            .pipe(source("app.dist.js"))
            .pipe(buffer())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(appConfig.dist));
    }
    
})();

/* Utils below. */

/**
 * Create Browserify bundler object.
 * @typedef { Object } confObj
 * @prop { Boolean } isDebug
 * @prop { Boolean } isWatchify
 * @prop { Object } envs
 * 
 * @param { confObj }
 */
function createBundler ({ isDebug = false, isWatchify = false, envs = { NODE_ENV: 'development' } }) {
    const config = {
        entries: appConfig.entry,
        debug: isDebug,
        cache: {},
        packageCache: {},
        plugin: []
    };
    isWatchify && config.plugin.push(watchify);
    return new browserify(config)
        .transform("babelify", babelConfig)
        .transform(envify(envs))
        .transform(cssify)
        .transform(jadeify)
        .transform(stylify);
}
