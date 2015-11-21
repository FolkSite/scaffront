var TplData = require('../../lib/helpers/tpl.data.js');

module.exports = function () {

  return TplData({
    title: 'Its a title!',
    user: require('./tpl/childtpl-data.js').user
  });

}();
