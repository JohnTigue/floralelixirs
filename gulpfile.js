// taken from: http://loige.co/gulp-and-ftp-update-a-website-on-the-fly/

'use strict';

var gulp  = require('gulp');
var gutil = require('gulp-util');
var ftp   = require('vinyl-ftp');

/** Configuration **/
var user = process.env.FTP_USER;
var password = process.env.FTP_PWD;
var host = 'floralelixirs.com';
var port = 21;
var localFilesGlob = ['./**/*'];
var remoteFolder = '/assests';


// helper function to build an FTP connection based on our configuration
function getFtpConnection() {
  return ftp.create({
    host: host,
    port: port,
    user: user,
    password: password,
    parallel: 5,
    log: gutil.log
    });
  }

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */
gulp.task('ftp-deploy', function() {
  var conn = getFtpConnection();

  return gulp.src(localFilesGlob, { base: '.', buffer: false })
    .pipe( conn.newer( remoteFolder ) ) // only upload newer files
    .pipe( conn.dest( remoteFolder ) );
  });

/**
 * Watch deploy task.
 * Watches the local copy for changes and copies the new files to the server whenever an update is detected
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy-watch`
 */
gulp.task('ftp-deploy-watch', function() {
  var conn = getFtpConnection();
  gulp
    .watch(localFilesGlob)
    .on('change', function(event) {
      console.log('Changes detected: uploading file "' + event.path + '", ' + event.type);
      return gulp.src( [event.path], { base: '.', buffer: false } )
        .pipe(conn.newer(remoteFolder)) // only upload newer files
        .pipe(conn.dest(remoteFolder));
      });
  });

gulp.task('default', function() {
  console.error('default does nothing');
  });
