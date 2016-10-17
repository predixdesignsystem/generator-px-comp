'use strict';
var generators = require('yeoman-generator'),
    chalk = require('chalk'),
    log = console.log;

/**
* Copies standard files we should always overwrite into our project.
*
* @module px-comp:common-boilerplate
*/
module.exports = generators.Base.extend({

  /** @namespace writing */
  writing: {

    /**
    * Copies standard files we should always overwrite. These will be the same
    * files used in the component generator. They require no template interpolation.
    *
    * @method commonWriteBoilerplate
    * @memberof writing
    */
    commonWriteBoilerplate: function() {
      console.log('writing...')
      log(chalk.yellow('\nAttempting to write boilerplate files...'));
      // Config files that will prefixed with a `.`
      this.fs.copy(
        this.templatePath('-jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('-gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('-bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.fs.copy(
        this.templatePath('-editorconfig'),
        this.destinationPath('.editorconfig')
      );

      // Github templates (heading to the `.github/` folder)
      this.fs.copy(
        this.templatePath('-github/PULL_REQUEST_TEMPLATE.md'),
        this.destinationPath('.github/PULL_REQUEST_TEMPLATE.md')
      );
      this.fs.copy(
        this.templatePath('-github/ISSUE_TEMPLATE.md'),
        this.destinationPath('.github/ISSUE_TEMPLATE.md')
      );

      // Misc. boilerplate
      this.fs.copy(
        this.templatePath('LICENSE.md'),
        this.destinationPath('LICENSE.md')
      );
      this.fs.copy(
        this.templatePath('CONTRIBUTING.md'),
        this.destinationPath('CONTRIBUTING.md')
      );
      this.fs.copy(
        this.templatePath('OSS_Notice.pdf'),
        this.destinationPath('OSS_Notice.pdf')
      );
      this.fs.copy(
        this.templatePath('monogram-wdmk.png'),
        this.destinationPath('monogram-wdmk.png')
      );
      this.fs.copy(
        this.templatePath('favicon.ico'),
        this.destinationPath('favicon.ico')
      );
    }
  }
});
