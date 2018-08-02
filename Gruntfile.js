const webpackOfflineTestConfig = require('./webpack.offline.test.config');

require('source-map-support').install();

module.exports = function(grunt) {
  grunt.initConfig({
    simplemocha: {
      all: {
        src: ['tests/dist/bundle.js']
      }
    },
    webpack: {
      dev: webpackOfflineTestConfig
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['test'],
        // options: {
        //   spawn: false,
        // },
      },
    },
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['webpack', 'simplemocha']);
  grunt.registerTask('default', 'test');
};