'use strict';

var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// meta: {
		// 	banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
		// 		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		// 		'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
		// 		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
		// 		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		// },
		watch: {
			scripts: {
				files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
				tasks: ['jshint', 'karma:unit']
			}
		},
		connect: {
			test: {
				options: {
					port: 9000,
					middleware: function (connect) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'test')
						];
					}
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
		},
		concat: {
			src: {
				src: ['src/provider.js', 'src/**/*.js'],
				dest: 'dist/ng-i18next.js'
			}
		},
		uglify: {
			src: {
				files: {
					'dist/ng-i18next.min.js': '<%= concat.src.dest %>'
				}
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},
		ngmin: {
			src: {
				src: '<%= concat.src.dest %>',
				dest: '<%= concat.src.dest %>'
			}
		}
	});

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['karma']);
	grunt.registerTask('build', ['jshint', 'concat', 'ngmin', 'uglify']);

	grunt.registerTask('dev', ['jshint', 'karma:unit', 'concat']);

};

