/*
 *  Babelify-gulp-starter By LancerComet at 22:14, 2016.05.28.
 *  # Carry Your World # 
 *  ---
 *  Gulpfile.
 */
const fs = require("fs")
const path = require('path')

const gulp = require("gulp")
const gulpUtil = require("gulp-util")
const rename = require("gulp-rename")

const aliasify = require("aliasify")
const browserify = require("browserify")
const cssify = require("cssify")
const envify = require("envify/custom")
const jadeify = require("jadeify")
const partialify = require("partialify/custom")
const requireAsync = require("browserify-require-async")
const stylify = require("stylify")
const through = require("through")
const watchify = require("watchify")

const utils = require('./utils')
const rootPath = path.resolve(__dirname, '.')

/**
 * App Configuration
 * @type { Object }
 */
const appConfig = {
  entry: [`${rootPath}/src/app.js`],
  srcPath: `${rootPath}/src`,
  distPath: `${rootPath}/dist`,
  assetsPath: `${rootPath}/dist/assets`,
  distFileName: 'app.dist.js'
}

/**
 * Babel Configuration.
 * @type { Object }
 */
const babelConfig = { 
  presets: ["es2015", "stage-2"]
}

/**
 * Default Task defination.
 */
gulp.task("default", ["js:dev"])

/**
 * JS Tasks Configuration.
 * All tasks deal with javascript will be set in here.
 */
;(function jsTasks () {

  /**
   * Task for development. It will watch whole project and keep bundling.
   */
  gulp.task("js:dev", function () {
      const bundler = createBundler({
        envs: { NODE_ENV: 'development' }
      })

      bundler
        .on("update", buildExec.bind(null, bundler))
        .on("log", gulpUtil.log)
        .on("error", function (err) {
          console.error(err.toString())
          this.emit("end")
        })

      return buildExec(bundler)
  })

  /**
   * Task for bundle only. It will exit when bundling finished.
   */
  gulp.task('js:build', function () {
      const bundler = createBundler({ 
        isDebug: false,
        isWatchify: false,           
        isUglify: true,
        envs: { NODE_ENV: 'production' }
      })

      bundler
        .on("log", gulpUtil.log)
        .on("error", function (err) {
          console.error(err.toString())
          this.emit("end")
        })

      return buildExec(bundler)
  })

  /**
   * Building Function.
   */
  function buildExec (bundler) {
    return bundler
      .bundle(function () {})  // Empty function for using minifyify.
      .pipe(fs.createWriteStream(`${appConfig.distPath}/${appConfig.distFileName}`))
  }
    
})();

/* Utils below. */

/**
 * Create Browserify bundler object.
 * @typedef { Object } confObj
 * @prop { Boolean } isDebug Enable Debug Support.
 * @prop { Boolean } isWatchify Enable Watchify Support.
 * @prop { Boolean } isUglify Enable Uglify.
 * @prop { Object } envs Enviroument variables.
 * 
 * @param { confObj }
 */
function createBundler ({ isDebug = true, isWatchify = true, isUglify = false, envs = { NODE_ENV: 'development' } }) {
  const browserifyConfig = {
    entries: appConfig.entry,
    debug: isDebug,
    cache: {},
    packageCache: {},
    plugin: []
  }

  const minifyConfig = {
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
  }

  isWatchify && browserifyConfig.plugin.push(watchify)

  const bundler = new browserify(browserifyConfig)
    .transform('babelify', babelConfig)

    // Configuration for code splitting build tasks.
    .transform(requireAsync, {
      url: '/dist/chunks',
      outputDir: './dist/chunks',
      setup () {
        const bConfig = browserifyConfig
        delete bConfig.entries
        delete bConfig.cache
        delete bConfig.packageCache

        const b = browserify(bConfig)
          .transform('babelify', babelConfig)
          .on("log", gulpUtil.log)
          .on("error", function (err) {
            console.error(err.toString())
            this.emit("end")
          })

        isWatchify && b.on('update', function () { b.bundle() })
        isUglify && b.plugin("minifyify", minifyConfig)

        return commonTransforms(b)
      }
    })

    isUglify && bundler.plugin("minifyify", minifyConfig)

    return commonTransforms(bundler)

    // Define common transformers here.
    function commonTransforms (bundler) {
      return bundler
        .transform(aliasify, {
          aliases: {
            'src': rootPath + '/src'
          }
        })
        .transform(partialify.onlyAllow(['json', 'xml']))
        .transform(envify(envs))
        .transform('browserify-postcss', {
          // Define postcss plugins if needed.
          plugin: [
            ['postcss-custom-url', [
              ['copy', {
                assetOutFolder: appConfig.assetsPath,
                baseUrl: '/assets',
                name: '[name].[hash]'
              }]
            ]],
            ['autoprefixer', { browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', "ie 8", "ie 9"] }]
          ],
          basedir: appConfig.srcPath,
          inject: true  // false: Style files will be required as string and must be inserted to html maunally. 
        })
        .transform(cssify)
        .transform(jadeify)
        .transform(utils.applyCSS)
    }
}
