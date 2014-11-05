module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      basic: {
        src: [],
        dest: 'dist/counterfeit.js'
      }
    },

    watch: {
      files: 'src/**/*.js',
      tasks: ["concat"]
    },
  });

  grunt.registerTask('default', ['watch']);
}
