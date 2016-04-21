const path = require('path');
const _ = require('../gulpfile.js/helpers.js');

var filePath = 'app/frontend/styles/dir/entry.css';

var baseDir = 'app/frontend/styles';
var targetDir = 'dist/frontend/css';

var resolveTargetFile = function resolveTargetFile (filePath, baseDir, targetDir) {
  'use strict';

  filePath  = _.preparePath(filePath, {startSlash: true, trailingSlash: false});
  baseDir   = _.preparePath(baseDir, {startSlash: true, trailingSlash: true});
  targetDir = _.preparePath(targetDir, {startSlash: true, trailingSlash: true});

  var parsedFilePath        = _.parsePath(filePath);
  var fileName              = parsedFilePath.base;
  var fileDirWithoutBaseDir = path.relative(baseDir, parsedFilePath.dir);
  var targetFile            = path.join(targetDir, fileDirWithoutBaseDir, fileName);

  console.log('targetFile', targetFile);

  return targetFile;
};

resolveTargetFile(filePath, baseDir, targetDir);

return;


var p1 = 'app/frontend/styles/dir/entry.css';
var p2 = 'app/frontend/styles';
var p3 = 'dist/frontend/css';

var prepared1 = _.preparePath(p1, {startSlash: true});
var prepared2 = _.preparePath(p2, {startSlash: true});
var prepared3 = _.preparePath(p3, {startSlash: true});

var parsed1 = _.parsePath(prepared1);
var parsed2 = _.parsePath(prepared2);

console.log('prepared1', prepared1);
console.log('prepared2', prepared2);

console.log('parsed1', parsed1.dir);
console.log('parsed2', parsed2.dir);

console.log('');

console.log(path.resolve(parsed1.dir, parsed2.dir));
console.log(path.resolve(parsed2.dir, parsed1.dir));

console.log('');

console.log(path.relative(parsed1.dir, parsed2.dir));
console.log(path.relative(parsed2.dir, parsed1.dir));

console.log('');

var result = path.join(prepared3, path.relative(parsed2.dir, parsed1.dir));
var resultPrepared = _.preparePath(result, {startSlash: false, trailingSlash: false});

var targetFile = path.join(process.cwd(), resultPrepared, parsed1.base);

console.log('result:', targetFile);


//console.log(path.relative(p1, '/app/frontend/css'));
