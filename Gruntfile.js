'use strict';

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		config: {
			src: './src',
			examples: './examples',
			dist: './dist'
		},

		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>' +
				' - Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},

		ngdocs: {
			options: {
				dest: '<%= config.dist %>/docs',
				title: 'ng-i18next',
				html5Mode: false,
				scripts: ['angular.js'],
				startPage: '/guide'
			},
			guide: {
				src: ['docs/content/guide/*.ngdoc'],
				title: 'Guide'
			}
		},

		watch: {
			js: {
				files: ['<%= config.src %>/**/*.js'],
				options: {
					livereload: true
				}
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.examples %>/{,*/}*.{html,js}',
					'{.tmp,<%= config.src %>}/{,*/}*.js'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					base: [
						'./',
						'<%= config.examples %>'
					]
				}
			},
			test: {
				options: {
					port: 9001,
					base: [
						'./',
						'test',
						'<%= config.examples %>'
					]
				}
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			},
			doc: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= config.dist %>/docs/*',
					]
				}]
			},
			server: '.tmp'
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'src/{,*/}*.js',
				'test/{,*/}*.js',
				'examples/{,*/}*.js'
			]
		},

		concat: {
			dist: {
				src: ['src/provider.js', 'src/{,*/}*.js'],
				dest: '<%= config.dist %>/<%= pkg.name %>.js'
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
				files: {
					'<%= config.dist %>/<%= pkg.name %>.min.js': [
						'<%= concat.dist.dest %>'
					]
				}
			}
		}

	});

	grunt.registerTask('serve', function (target) {

		if (target === 'dist') {
			return grunt.task.run(['build', 'connect:dist:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'connect:livereload',
			'watch'
		]);

	});

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('test', [
		'clean:server',
		'connect:test',
		'karma'
	]);

	/*
	 * 'build' neither tests the script nor does it run jshint!
	 * Also it does not create the documentation!
	 */
	grunt.registerTask('build', [
		'clean:dist',
		'concat',
		'uglify'
	]);

	grunt.registerTask('build:doc', [
		'clean:doc',
		'ngdocs'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build',
		'ngdocs'
	]);

};

