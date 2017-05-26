// Karma configuration

'use strict';

module.exports = function (config) {

	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: './src/',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine', 'karma-typescript'],

		files: [
			'../node_modules/angular/angular.js',
			'../node_modules/angular-mocks/angular-mocks.js',
			'../node_modules/angular-sanitize/angular-sanitize.js',
			'../node_modules/i18next/i18next.js',
			'../node_modules/i18next-xhr-backend/i18nextXHRBackend.js',
			'../node_modules/i18next-sprintf-postprocessor/i18nextSprintfPostProcessor.js',

			{ pattern: './*.ts', included: true },

		],

		preprocessors: {
            './**/!(*spec).ts': ['karma-typescript', 'coverage'],
			'./*.spec.ts': ['karma-typescript']
		},

		reporters: ["progress", "karma-typescript"],

		karmaTypescriptConfig: {
			tsconfig: "../tsconfig-karma.json"
		},

		// list of files to exclude
		exclude: [],

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
