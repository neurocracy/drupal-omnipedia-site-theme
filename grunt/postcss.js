module.exports = function(grunt, options) {

  'use strict';

  return {
    stylesheets: {
      options: {
        map: {
          inline: false
        },
        processors: [
          require('postcss-easing-gradients'),
          require('autoprefixer'),
        ]
      },
      files: [{
        src:    '<%= pathTemplates.stylesheets %>/**/*.css',
        ext:    '.css',
        extDot: 'last',
        expand: true,
      }]
    }
  };

};
