'use strict';
var generators = require('yeoman-generator'),
    chalk = require('chalk'),
    log = console.log;

/**
* Copies standard CSS module files we should always overwrite into our project.
*
* @module px-comp:css-boilerplate
*/
module.exports = generators.Base.extend({

  /** @namespace writing */
  writing: {

    /**
    * Copies standard files we should always overwrite. These will be the same
    * files used in the component generator. They require no template interpolation.
    *
    * @method cssWriteBoilerplate
    * @memberof writing
    */
    cssWriteBoilerplate: function() {
      console.log('writing...')
      log(chalk.yellow('\nAttempting to write CSS boilerplate files...'));
      // These should be the same for every repo
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );
      this.fs.copy(
        this.templatePath('scripts/ghp.sh'),
        this.destinationPath('scripts/ghp.sh')
      );
    }
  }
});
