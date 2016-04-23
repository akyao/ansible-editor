module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'build/style.css': ['src/style.scss']
        }
      }
    },
    cssmin: {
      minimize: {
        files: {
          'build/style.min.css': ['build/style.css']
        }
      }
    },
    watch: {
      files: 'src/*.scss',
      tasks: ['sass', 'cssmin']
    }
  });

  // plugin
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-csslint');

  // task
  grunt.registerTask('default', ['sass', 'cssmin', 'watch']);
};
