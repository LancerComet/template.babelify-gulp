import component from '../templates/component.jade'
import greeting from '../hello-es2015'

document.body.innerHTML = component({
  greeting,
  env: process.env.NODE_ENV
})

module.exports = function () {
  console.log('Async loading!')
}
