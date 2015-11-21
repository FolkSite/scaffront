var TplData = require('../../../lib/helpers/tpl.data.js');

module.exports = function () {
  return TplData({
    user: {
      username: 'Its username',
      description: 'Its description!'
    }
  });
}();
