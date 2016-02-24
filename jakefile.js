"use strict";


var releaseFiles = [
    'index.html',
    'js',
    'css',
    'fonts',
    'templates'
];

desc('Compile all sources to make a live version.');
task('default', ['compile:all']);

desc('Installs all dependencies');
task('install-deps', {async: true}, function () {
    jake.exec("node_modules/.bin/bower install", function () {
        complete();
    });
});

namespace('compile', function () {
    desc('Compiles all sources');
    task('all', ['js', 'css', 'fonts'], function () {
        console.log("Build complete.");
    });

    desc('Creates CSS files');
    task('css', {async: true}, function () {
        jake.mkdirP('web/css');
        jake.exec("lessc -x ./web/less/main.less > ./web/css/main.css", function () {
            complete();
        });
    });

    desc('Copies font files into correct directory');
    task('fonts', {async: true}, function () {
        jake.mkdirP('web/fonts');
        jake.exec("cp ./web/lib/bootstrap/fonts/* ./web/fonts/", function () {
            complete();
        });
    });

    desc('Compiles the Javascript');
    task('js', {async: true}, function () {
        jake.mkdirP('web/js');
        jake.exec([
            "node_modules/.bin/r.js -o ./web/js-dev/app.build.js",
            "node_modules/.bin/r.js -o name=./web/lib/requirejs/require.js out=./web/js/require.js baseUrl=."
        ], function () {
            complete();
        });
    });
});

namespace('release', function () {
    desc('Creates a release.');
    task('create', {async: true}, ['compile:all'], function () {
        var packageJson = require('./package.json'),
            version     = packageJson.version;

        jake.mkdirP('dist');
        jake.exec([
            "tar -zcvf dist/v" + version + ".tar.gz -C web " + releaseFiles.join(" ")
        ], function () {
            complete();
        });
    });
});