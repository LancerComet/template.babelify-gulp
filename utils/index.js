const through = require('through')

module.exports = {
  /**
   * Apply css requirement to page.
   */
  applyCSS (file) {
    var data = ''
    return through(write, end)

    function write (buffers) { data += buffers }
    function end () {
      if (file.match(/.css$/)) {
        console.log('applyCSS')
        console.log('\n================= file: ==================\n', file)
        console.log(data)
      }
      this.queue(data);
      this.queue(null);
    }
  }
}