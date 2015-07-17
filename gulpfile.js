'use strict';

var fs      = require('fs'),
    path    = require('path'),
    gulp    = require('gulp'),
    $       = require('gulp-load-plugins')({ lazy: true }),
    config  = require('./gulpfile.config.js'),
    pkg     = require('./package.json');


// ---------------------------------------------------------------------
// | Tasks
// ---------------------------------------------------------------------

gulp.task('clean',          clean);
gulp.task('js',             jsApp);
gulp.task('jsVendor',       jsVendor);
gulp.task('css',            cssApp);
gulp.task('cssVendor',      cssVendor);
gulp.task('images',         images);
gulp.task('markdown',       markdown);
gulp.task('handlebars',     handlebars);
gulp.task('misc',           misc);
gulp.task('watch',          watch);
gulp.task('rev',            rev);
gulp.task('size',           size);

gulp.task('render', gulp.parallel('markdown', 'handlebars'));

gulp.task('compile', gulp.parallel('js', 'jsVendor', 'css', 'cssVendor', 'images', 'render', 'misc'));

gulp.task('build', gulp.series('clean', 'compile', 'rev', 'size'));

gulp.task('default', gulp.series('build'));

// ---------------------------------------------------------------------
// | Definitions
// ---------------------------------------------------------------------

function isProduction(){
  return config.options.env === 'production';
}

function clean(done){
  require('del')(config.output(''), done);
}

function js(filename, files){
  return gulp.src(files)
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.concat(filename))
    .pipe($.if(isProduction(), $.uglify()))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.output('/js')));
}

function jsApp(){
  return js('app.js', config.files.js);
}

function jsVendor(){
  return js('vendor.js', config.files.jsVendor);
}

function css(filename, files){
  return gulp.src(files)
    .pipe($.less({ paths: [ path.join(__dirname, 'less') ]  }))
    .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%'] }))
    .pipe($.if(isProduction(), $.csso()))
    .pipe(gulp.dest(config.output('/css')));
}

function cssApp(){
  return css('app.css', config.files.css);
}

function cssVendor(){
  return css('vendor.css', config.files.cssVendor);
}

function watch(){
  gulp.watch(config.files.js,                 gulp.series('js'));
  gulp.watch(config.files.jsVendor,           gulp.series('jsVendor'));
  gulp.watch(config.files.cssWatch,           gulp.series('css'));
  gulp.watch(config.files.cssVendor,          gulp.series('cssVendor'));
  gulp.watch(config.files.images,             gulp.series('images'));
  gulp.watch(config.files.misc,               gulp.series('misc'));
  gulp.watch(config.files.markdown,           gulp.series('markdown'));
  gulp.watch(config.files.handlebars,         gulp.series('handlebars'));
  gulp.watch(config.files.templates.layouts,  gulp.series('render'));
  gulp.watch(config.files.templates.partials, gulp.series('render'));
}

function images(){
  return gulp.src(config.files.images)
    .pipe($.cached())
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.output('/images')));
}

function misc(){
  return gulp.src(config.files.misc, { base: 'src/site' })
    .pipe(gulp.dest(config.output('')));
}

function markdown(done){
  done();
}

var es = require('event-stream');
var async = require('async');

function handlebars(done){

  var layouts = {},
      partials = {},
      data = {};
  
  es.concat(
    gulp.src('src/templates/layouts/**/*.hbs')
      .pipe($.extract(layouts)),    
    gulp.src('src/templates/partials/**/*.hbs')
      .pipe($.extract(partials))
  )
  .on('end', function(){
    gulp.src('src/site/**/*.hbs')
      .pipe($.handlebarsExtended(data, { layouts: layouts, partials: partials }))
      .pipe(gulp.dest(config.output('')))
      .on('finish', function(){
        done();
      });
  });
}

function rev(){
  var assets = $.useref.assets({ searchPath: config.output('/**/*') });
  return gulp.src(config.output('/**/*.html'))
    .pipe(assets)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if(isProduction(), $.if('*.html', $.minifyHtml({ conditionals: true, loose: true }))))
    .pipe(gulp.dest(config.output('')));
}

function size(){
  return gulp.src(config.output('/**/*'))
    .pipe($.size({title: 'build', gzip: true}));
}
