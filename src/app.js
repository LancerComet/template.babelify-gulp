import insertCss from 'insert-css';
const cssStyle = require('./style/index.css')

console.log(cssStyle)
insertCss(cssStyle);

require.async('./module/lazy', function (lazy) {
  lazy()
});

console.log('greeting')
