import { greeting } from "./hello-es2015.js";
const stylString = require('./style.styl')
const component = require('./component.jade')

window.TEST = process.env.NODE_ENV

document.body.innerHTML = component({
    greeting
});
