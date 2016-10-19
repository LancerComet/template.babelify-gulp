import insertCss from 'insert-css';
import stylusString from './style/index.styl';

insertCss(stylusString);

require.async('./module/lazy', function (lazy) {
  lazy()
});
