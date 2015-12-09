var _                 = require('lodash'),
    __                = require('../helpers'),
    gulp              = require('gulp'),
    gulpUtil          = require('gulp-util'),
    runSequence       = require('run-sequence').use(gulp),
    del               = require('del'),
    getObject         = require('getobject')
  ;

var server       = null,
    config       = require('../_config'),
    copierConfig = config.copier.config,
    copierUtils  = config.copier.utils,
    serverConfig = config.server.config,
    serverUtils  = config.server.utils;


gulp.task('copier:build', function (cb) {
  var stream = copierUtils.copy(getObject.get(copierConfig, 'copier'), cb);

  if (stream && gulpUtil.isStream(stream)) {
    server && serverUtils.reloadServer(serverConfig.devServerName, stream);

    return stream;
  }
});

gulp.task('copier:build:cleanup', function (cb) {
  return copierUtils.cleanup(getObject.get(copierConfig, 'build'), cb);
});


gulp.task('copier:dist', function (cb) {
  runSequence('copier:build', cb);
});

gulp.task('copier:dist:cleanup', function (cb) {
  runSequence('copier:build:cleanup', cb);
});

