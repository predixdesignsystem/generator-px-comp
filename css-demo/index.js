'use strict';
var generators = require('yeoman-generator'),
    chalk = require('chalk'),
    log = console.log;

/**
* Creates the files for a CSS demo.
*
* @module px-comp:css-demo
*/
module.exports = generators.Base.extend({

  /** @namespace writing */
  writing: {

    /**
    * These files should only be created the first time we run demo-ify. They
    * can't be re-run later.
    *
    * @method cssWriteDemo
    * @memberof writing
    */
    cssWriteDemo: function() {
      log(chalk.yellow('\nAttempting to write CSS demo files...'));

      // @TODO Rewrite the rename the px-MODULENAME-design-demo to the correct
      // name and write the _index.html to use templates to fill in right info.

      // @TODO .travis.yml should probably be created at the same time as we go
      // get a deploy key from Github, encrypt it, and add it to the file

      this.fs.copy(
        this.templatePath('_index.html'),
        this.destinationPath('_index.html')
      );

      this.fs.copy(
        this.templatePath('-travis.yml'),
        this.destinationPath('.travis.yml')
      );

      this.fs.copy(
        this.templatePath('sass/px-MODULENAME-design-demo.scss'),
        this.destinationPath('sass/px-MODULENAME-design-demo.scss')
      );
      
    }
  }
});
