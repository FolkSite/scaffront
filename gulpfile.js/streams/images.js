//var imgSrc = 'src/img/**';
//var imgDest = 'build/img';
//gulp.task('images', function() {
//  return gulp
//    .src(imgSrc)
//    .pipe($.newer(imgDest))
//    .pipe($.imagemin({
//      optimizationLevel: 2, // png
//      interlaced: true,     // gif
//      progressive: true,    // jpg
//      multipass: true,      // svg
//      svgoPlugins: [
//        { removeViewBox: false },               // don't remove the viewbox atribute from the SVG
//        { removeUselessStrokeAndFill: false },  // don't remove Useless Strokes and Fills
//        { removeEmptyAttrs: false }             // don't remove Empty Attributes from the SVG
//      ],
//      use: [
//        PngQuant({
//          quality: '80-90',
//          speed: 4
//        })
//      ]
//    }))
//    .pipe(gulp.dest(imgDest));
//});
