module.exports = function (grunt) {
  grunt.initConfig({
    watch: {
      build: {
        files: ['lib/**/*.js'],
        tasks: ['build']
      }
    },

    concat: {
      build: {
        src: [
          'lib/hsvToRgb.js',
          'lib/fair-slicer.js',
          'lib/color-slicer.js'
        ],
        dest: 'dist/color-slicer.js'
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    jshint: {
      src: [
        'lib/**/*.js',
        'test/**/*.js',
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('build', ['concat']);
  grunt.registerTask('default', ['build', 'watch']);
};
