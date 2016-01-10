// Karma configuration

'use strict';

module.exports = function(config) {

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		files: [
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'node_modules/i18next-client/i18next.min.js',
			'src/provider.js',
			'src/{,*/}*.js',
			'test/polyfills/*.js',
			'test/{,*/}*Spec.js'
		],

		// list of files to exclude
		exclude: [],

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher'
		],

		// web server port
		port: 9876,

		// cli runner port
		runnerPort: 9100,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		singleRun: true,

		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000

	});
};
