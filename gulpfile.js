const gulp = require('gulp');
const open = require('gulp-open');
const connect = require('gulp-connect');
const webpack = require('webpack-stream');
const webpackConfig = require ('./webpack.config');

const config = {
    paths: {
        src: {
            entry:     './src/entry.js',
            html:      './src/*.html',
            css:       './src/*.css',
            shadowCss: './src/**/*.shadow.css',
            js:        './src/**/*.js'
        },
        dist: './dist/'
    },
    localServer: {
        port: 8001,
        url: 'http://localhost:8001/'
    }
};

gulp.task('babel', function () {
    return gulp.src(config.paths.src.entry)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(config.paths.src.js, gulp.series('babel'));
    gulp.watch(config.paths.src.html, gulp.series('html'));
    gulp.watch(config.paths.src.css, gulp.series('css'));
    gulp.watch(config.paths.src.shadowCss, gulp.series('babel'));
});

gulp.task('html', function () {
    return gulp.src(config.paths.src.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('css', function () {
    return gulp.src(config.paths.src.css)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    return connect.server({
        root: config.paths.dist,
        port: config.localServer.port,
        livereload: true
    });
});

gulp.task('open', function () {
    gulp.src(config.paths.dist + 'index.html')
    .pipe(open({uri: config.localServer.url, app: 'iexplore' }));
});

gulp.task('copy', gulp.parallel('html', 'css', 'babel'));
gulp.task('run-server', gulp.parallel('connect', 'open'))
gulp.task('run-server-and-watch', gulp.parallel('run-server', 'watch'));

gulp.task('default', gulp.series('copy', 'run-server-and-watch'));