import component from '../templates/component.jade'
import greeting from '../hello-es2015'

module.exports = function () {
  document.body.innerHTML = component({
    greeting,
    env: process.env.NODE_ENV
  });
}
