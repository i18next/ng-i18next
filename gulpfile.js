'use strict';

var gulp = require('gulp');

var pkg = require('./package.json');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var size = require('gulp-size');
var header = require('gulp-header');
var rimraf = require('gulp-rimraf');
var rollup = require('gulp-rollup');
var typescript = require('rollup-plugin-typescript');
var karma = require('karma').Server;
var bump = require('gulp-bump'),

getToday = function () {

	var today = new Date();
	var dd = 	today.getDate();
	var mm = 	today.getMonth() + 1; //January is 0!
	var yyyy =  today.getFullYear();

	if (dd < 10) {
		dd = '0' + dd;
	}

	if (mm < 10) {
		mm = '0' + mm;
	}

	return yyyy + '-' + mm + '-' + dd;

};

var headerMeta = ['/*!',
	' * <%= pkg.name %> - Version <%= pkg.version %> - ' + getToday(),
	' * Copyright (c) ' + new Date().getFullYear() + ' <%= pkg.author.name %>',
	' *',
	' * <%= pkg.description %>',
	' *',
	' * - Source: https://github.com/i18next/ng-i18next/',
	' * - Issues: https://github.com/i18next/ng-i18next/issues',
	' *',
	' * License: <%= pkg.license %> - https://github.com/i18next/ng-i18next/blob/master/LICENSE',
	' *',
	'*/\n'
].join('\n');

var headerMetaMin = '/*! <%= pkg.name %> - <%= pkg.version %> - ' + getToday() +
	' - Copyright (c) ' + new Date().getFullYear() + ' <%= pkg.author.name %>; Licensed <%= pkg.license %>*/';

gulp.task('bump', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

gulp.task('clean', [], function () {
	//remove old files
	return gulp.src(['./dist/*', './build/*'], { read: false })
		.pipe(rimraf());
});

gulp.task('rollup', ['clean'], function () {
	return gulp.src(['./src/*.ts'])
		.pipe(rollup({
			allowRealFiles: true,
			entry: 'src/provider.ts',
			format: 'umd',
			moduleName: 'ngI18next',
			dest: 'dist/ng-i18next.js',
			external: [
				'typescript'
			],
			plugins: [
				typescript()
			]
		}))
		.pipe(rename('ng-i18next.js'))
		.pipe(gulp.dest('./build/'));
});

gulp.task('concat', ['clean', 'rollup'], function () {
	return gulp.src('./build/ng-i18next.js')
		.pipe(header(headerMeta, { pkg: pkg }))
		.pipe(gulp.dest('./dist/'))
		.pipe(rename(pkg.name + '.min.js'))
		.pipe(uglify())
		.pipe(header(headerMetaMin, { pkg: pkg }))
		.pipe(size())
		.pipe(gulp.dest('./dist/'));
});

//run tests
gulp.task('karma', ['clean', 'rollup', 'concat'], function () {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
	});
});

//watch tests
gulp.task('karma-watch', ['clean', 'rollup', 'concat'], function () {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		browsers: ['Chrome'],
		singleRun: false,
		autoWatch: true
	});
});


//TODO: documentation

gulp.task('default', function () {

	var info = [
		'',
		'  Usage:',
		'    - build: `gulp build`',
		'    - watch & test: `gulp watch`',
		'    - run examples: `gulp serve`',
		'      - Then open http://localhost:8000',
		'',
		'  For pull requests please run:',
		'    gulp test',
		'    gulp rollup',
		''
	].join('\n');

	console.info(info);
});

gulp.task('test', ['clean', 'rollup', 'concat', 'karma']);

gulp.task('serve', [], function () {

	gulp.src('./')
		.pipe(webserver({
			livereload: true,
			fallback: './examples/index.html'
		}));

});

gulp.task('build', ['ci'])

gulp.task('ci', ['clean', 'rollup', 'concat', 'test']);
