// Karma configuration

'use strict';

module.exports = function (config) {

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		files: [
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/angular-sanitize/angular-sanitize.js',
			'bower_components/i18next/i18next.js',
			'bower_components/i18next-xhr-backend/i18nextXHRBackend.js',
			'bower_components/i18next-sprintf-postprocessor/i18nextSprintfPostProcessor.js',
			'./dist/ng-i18next.js',
			'test/{,*/}*Spec.js'
		],

		// list of files to exclude
		exclude: ['gulpfile.js'],

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
