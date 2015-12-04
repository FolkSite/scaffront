var __ = require('../../helpers');

var config = {};

config.src = 'app/fonts-tocss';
// sequence
config.convert = [{
  from: 'svg',
  to: 'ttf',
  options: {}
}, {
  from: 'ttf',
  to: 'woff',
  options: {}
}];
config.dest = 'dist/css';

// всё останое из шрифта будет вырезано для экономии
config.glyphs = 'ёйцукенгшщзхъфывапролджэ\\ячсмитьбю.ЁЙЦУКЕНГШЩЗХЪФЫВАПРОДЖЭ/ЯЧСМИТЬБЮ,`qwertyuiop[]asdfghjkl;\'\\zxcvbnm,./~QWERTYUIOP{}ASDFGHJKL:"|ZXCVBNM<>?123456789!"№;%:?*()-=@#$%^&*()_+';

module.exports = config;
