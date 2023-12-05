module.exports = {
  paths: {
    dist: {
      dir: 'dist',
      all: 'dist/**/*'
    },
    vendor: {
      all: 'node_modules/**'
    },
    views: {
      all: 'src/views/**/*.hbs',
      dest: 'dist/views',
      entry: 'dist/views/resume.hbs',
      partials: 'dist/views/partials/**/*.hbs',
      components: 'dist/views/components/**/*.hbs'
    },
    images: {
      all: 'src/images/**/*',
      dest: 'dist/images'
    },
    fonts: {
      all: 'src/fonts/**/*',
      dest: 'dist/fonts'
    },
    styles: {
      all: 'style.css',
      dest: 'dist/styles',
      entry: 'dist/styles/main.css'
    },
    js: {
      all: '**/*.js'
    }
  },
  names: {
    resume: {
      data: 'resume.json',
      dest: 'resume'
    }
  }
}
