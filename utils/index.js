const through = require('through')

const _done = {
  es6Promise: false
}

module.exports = {
  /**
   * Promise shim for old browser enviroument.
   */
  es6Promise (file) {
    var data = ''
    if (!_done.es6Promise) {
      data = 'require("es6-promise").polyfill();\n'
      _done.es6Promise = true
    }
    return through(write, end)

    function write (buffers) { data += buffers }
    function end () {
      this.queue(data);
      this.queue(null);
    }
  }
}