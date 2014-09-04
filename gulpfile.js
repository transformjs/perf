'use strict';

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

['patch', 'minor', 'major'].forEach(function(type) {
    gulp.task(type, function() {
        gulp.src('./*.json')
            .pipe(plugins.bump({type: type}))
            .pipe(gulp.dest('./'))
            .pipe(plugins.git.add())
            .pipe(plugins.git.commit('task: bump package version'))
            .pipe(plugins.filter('package.json'))
            .pipe(plugins.tagVersion({prefix: ''}));
    });
});

gulp.task('default', ['patch']);
