// подключать этот файл куда-нибудь - необязательно

/**
 * @typedef {{}}                  BundleConfig
 * @property {{}}                 build
 * @property {String|string[]}    build.entry Maybe a file or full path to file (relative to project path)
 * @property {String}             [build.src]
 * @property {String}             [build.dest]
 * @property {String}             [build.outfile] Maybe a file or full path to file (relative to project path). If is undefined then outfile's name will be equal to entry filename
 * @property {{}}                 [build.options] Will be passed to Browserify constructor
 * @property {Function}           [build.setup] This function takes one argument "bundler" and here you can setup the bundler
 * @property {Function}           [build.callback] Will be passed to ".bundle()": .bundle(callback)
 * @property {{}}                 [dist]
 * @property {boolean}            [dist.polyfilly]
 * @property {boolean}            [dist.minify]
 * @property {{}}                 [dist.autoPolyfillerConfig]
 * @property {{}}                 [dist.uglifyConfig]
 * @property {boolean}            [validated] Generated property
 * @property {null|*}             [bundler] Generated property
 */
