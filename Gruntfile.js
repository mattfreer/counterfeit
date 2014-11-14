module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      basic: {
        src: ['src/counterfeit.js', 'src/promise.js', 'src/stub.js', 'src/counterfeit_fac.js'],
        dest: 'dist/counterfeit.js'
      }
    },

    uglify: {
      basic: {
        files: {
          'dist/counterfeit.min.js': ['src/counterfeit.js', 'src/promise.js', 'src/stub.js', 'src/counterfeit_fac.js']
        }
      }
    },

    watch: {
      files: 'src/**/*.js',
      tasks: ["concat", "uglify"]
    },
  });

  grunt.registerTask('default', ['watch']);
}
