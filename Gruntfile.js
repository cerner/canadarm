module.exports = function (grunt) {
  var canadarmFiles = [
    'lib/intro.js',
    'lib/constant.js',
    'lib/level.js',
    'lib/utils.js',
    'lib/core.js',
    'lib/appender/**/*.js',
    'lib/handler/**/*.js',
    'lib/instrument/**/function.js',
    'lib/instrument/**/global.js',
    'lib/instrument/**/event.js',
    'lib/mock.js',
    'lib/outro.js'
  ];

  // Grunt Loaded Tasks
  // http://chrisawren.com/posts/Advanced-Grunt-tooling
  // ------------------------------------------------
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    availabletasks: {
      tasks: {
        options: {
          filter: 'exclude',
          tasks: ['availabletasks', 'default', 'concat', 'uglify']
        }
      }
    },

    // Order of these files matters.  Specifically intro.js must be first
    // and outro.js must be last.  The build will fail if other files are
    // not in the correct order.
    concat: {
      canadarm: {
        files: {
          'build/canadarm.js': canadarmFiles,
          'example/js/canadarm.js': canadarmFiles
        }
      }
    },

    jsdoc : {
        dist : {
            src: ['lib/appender/*.js', 'lib/handler/*.js', 'lib/utils.js',
              'lib/instrument/*.js', 'lib/core.js', 'lib/level.js', 'lib/constant.js'],
            options: {
                destination: 'docs'
            }
        }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/unit/**/*.js']
      }
    },

    uglify: {
      candarm: {
        files: {
          'build/canadarm.min.js': ['build/canadarm.js']
        }
      }
    },

    jshint: {
      all: [
        'lib/appender/**/*.js',
        'lib/handler/**/*.js',
        'lib/instrument/**/function.js',
        'lib/instrument/**/global.js',
        'lib/instrument/**/event.js',
        'lib/constant.js',
        'lib/core.js',
        'lib/level.js'
      ],
      concat: ['build/canadarm.js'],
      options: {
        jshintrc: true
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['availabletasks']);

  // Convenience task to check lint and run tests once they exist
  grunt.registerTask('test', ['mochaTest']);

  // Add a task that builds our canadarm.js file
  grunt.registerTask('build', ['jshint', 'concat', 'jshint:concat', 'uglify', 'test', 'jsdoc']);
};
