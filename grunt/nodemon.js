/**
 * Created by alivanov on 12/01/16.
 */

module.exports = {
  dev: {
    script: 'index.js',
    options: {
      ignore: [
        'node_modules/**',
        'grunt/**',
        'gruntfile.js',
        'test/**'
      ],
      watchedExtensions: ['js'],
      args: [],
      ext: 'js',
      nodeArgs: ['--debug'],
      delayTime: 1
    }
  }
};
