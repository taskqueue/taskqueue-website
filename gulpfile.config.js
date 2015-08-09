'use strict';

module.exports = {

  port: 4200,

  output: output,
  options: options(),
  templates: loadTemplates(),

  files: {
    self: 'gulpfile.config.js',
    js: [
      'src/js/**/*.js',
      '!src/js/vendor/**'
    ],
    jsVendor: [
      'src/bower_components/jquery/dist/jquery.js',
      'src/bower_components/modernizr/modernizr.js',
      'src/js/vendor/**/*.js'
    ],
    css: [
      'src/less/**/app.less'
    ],
    cssWatch: [
      'src/less/**/*.less'
    ],
    cssVendor: [
    ],
    images: [
      'src/images/**/*'
    ],
    markdown: [
      'src/site/**/*.md'
    ],
    handlebars: [
      'src/site/**/*.hbs'
    ],
    misc: [
      'src/site/**/*',
      '!src/site/**/*.{hbs,md}'
    ],
    templates: {
      layouts: 'src/templates/layouts/*.hbs',
      partials: 'src/templates/partials/*.hbs'
    }
  }
};

/**
 * Returns the output path for a path that is relative
 * to the output root.
 */
function output(relative){
  return 'app' + relative;
}

/**
 * Returns the commandline args, with defaults if not specified.
 */
function options(){

    var knownOptions = {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'development' }
  };

  return require('minimist')(process.argv.slice(2), knownOptions);
}

/**
 * Loads all handlebars templates.
 */
function loadTemplates(){

}
