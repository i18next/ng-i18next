const { series, src, dest } = require('gulp');

const pkg = require('./package.json');

const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const rename = require('gulp-rename');
const size = require('gulp-size');
const header = require('gulp-header');
const rimraf = require('gulp-rimraf');
const rollup = require('gulp-rollup');
const typescript = require('rollup-plugin-typescript');
const karma = require('karma').Server;
const bump = require('gulp-bump'),

  getToday = function() {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();

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

function clean() {
	//remove old files
	return src(['./dist/*', './build/*'], { read: false })
		.pipe(rimraf());
}

function rollupLib() {
	return src(['./src/*.ts'])
		.pipe(rollup({
			allowRealFiles: true,
			input: 'src/provider.ts',
			format: 'umd',
			file: 'dist/ng-i18next.js',
			name: 'ngI18next',
			globals: {
				angular: 'angular', i18next: 'i18next'
			},
			external: [
				'typescript',
				'angular'
			],
			plugins: [
				typescript()
			]
		}))
		.pipe(rename('ng-i18next.js'))
		.pipe(dest('./build/'));
}

function concatLib() {
	return src('./build/ng-i18next.js')
		.pipe(header(headerMeta, { pkg: pkg }))
		.pipe(dest('./dist/'))
		.pipe(rename(pkg.name + '.min.js'))
		.pipe(uglify({ mangle: false }))
		.pipe(header(headerMetaMin, { pkg: pkg }))
		.pipe(size())
		.pipe(dest('./dist/'));
}

//run tests
function karmaTest(done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
	}, function () {
		done();
	});
}

//watch tests
function karmaTestWatch() {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		browsers: ['Chrome'],
		singleRun: false,
		autoWatch: true
	});
}


//TODO: documentation

function info(done) {

	var info = [
		'',
		'  Usage:',
		'    - build: `gulp build`',
		'    - watch & test: `gulp karmaWatch`',
		'    - run examples: `gulp serve`',
		'      - Then open http://localhost:8000',
		'',
		'  For pull requests please run:',
		'    gulp test',
		'    gulp rollup',
		''
	].join('\n');

	console.info(info);

	done()
}

function serve(done) {
	src('./')
		.pipe(webserver({
			livereload: true,
			fallback: './examples/index.html'
		}));
	done();
}

exports.test = series(clean, karmaTest, rollupLib, concatLib);
exports.build = series(clean, karmaTest, rollupLib, concatLib);
exports.karmaWatch = series(clean, karmaTestWatch);
exports.serve = series(clean, karmaTest, rollupLib, concatLib, serve);
exports.default = series(info);
