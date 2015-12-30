var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('test-logging', function (callback) {
    exec('mocha', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('set-env-var', function () {
    process.env.AZURE_STORAGE_ACCOUNT = '... sensitive information removed ...';
    process.env.AZURE_STORAGE_ACCESS_KEY = '... sensitive information removed ...';
});

gulp.task('test', ['set-env-var', 'test-logging']);