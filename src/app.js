import stylusString from './style/index.styl';
import insertCss from 'insert-css';

insertCss(stylusString);

require.async('./module/lazy', function (lazy) {
  lazy()
});
