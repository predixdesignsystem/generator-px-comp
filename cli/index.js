'use strict';
var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    generators = require('yeoman-generator'),
    chalk = require('chalk'),
    s = require('underscore.string'),
    mkdirp = require('mkdirp'),
    spawn = require('child_process').spawn,
    exec = require('child_process').exec,
    pxutil = require('./../util/index'),
    prompts = require('./prompts');

var PxComponentGenerator = generators.Base.extend({});

const constants = require('../util/constants');

process.on('error', function(err) {
    log.error('Uncaught exception occurred in application!', err.stack || err.message || err);
    process.exit(2);
});

util.inherits(PxComponentGenerator, generators.Base);

module.exports = PxComponentGenerator.extend({

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.opts = {};
    this.todos = this.opts.todos = [];

    this.option('module-type', {
        desc: 'Choose the type of module (options: "css" or "component")',
        type: String,
        defaults: ''
    });

    this.option('module-name', {
        desc: 'The name of the module',
        type: String,
        defaults: ''
    });

    this.option('existing', {
        desc: 'Make changes to an existing Predix UI module',
        type: Boolean,
        defaults: false
    });

    this.option('skip-tool-check', {
        desc: 'Skip check for necessary tools (npm, bower, git)',
        type: Boolean,
        defaults: false
    });

    this.option('skip-install', {
        desc: 'Skip npm and bower install tasks',
        type: Boolean,
        defaults: false
    });

    this.option('not-ge', {
        desc: 'Don\'t include GE-specific files (license, OSS_Notice, etc.)',
        type: Boolean,
        defaults: false
    });

    this.option('prefix', {
        desc: 'Specify a custom component prefix (defaults to "px-")',
        type: String,
        defaults: ''
    });

    this.moduleType = this.opts.moduleType = this.options['module-type'] || '';
    this.moduleName = this.opts.moduleName = this.options['module-name'] || '';
    this.isExisting = this.opts.isExisting = this.options['existing'];
    this.skipToolCheck = this.opts.skipToolCheck = this.options['skip-tool-check'];
    this.skipInstall = this.opts.skipInstall = this.options['skip-install'];
    this.notGe = this.opts.notGe = this.options['not-ge'];
    this.pre = this.opts.pre = this.options['prefix'].length ? this.options['prefix'] : constants.PREFIX;
  },

  initializing: {
    // Checks should go in here
    // So should reading the repo, if existing
    readPackageIfExisting: function readPackageIfExisting() {
      if (!this.isExisting) return;

      // Check to see if we have a package. If we don't, throw an error.
      const pathToPackage = this.destinationPath('package.json'),
            hasPackage = fs.existsSync(pathToPackage);

      var done = this.async(),
          say = pxutil.spin('Reading package.json...'),
          errMsg = chalk.red(`\n!!! Couldn\'t find or read a package.json file in path ${pathToPackage}. A valid package.json is necessary to run tasks on an existing module.\n\nIf you want to start a new module from scratch, don't run with the existing option. Otherwise, make sure you start the task in the right directory.\n\n`);

      if (!hasPackage) done(new Error(errMsg));

      try {
        // Try to read the the raw package into a string then parse it into a
        // JavaScript object. If we succeed, add the path to the package and
        // the resulting object to `this`.
        var rawPackageJson = fs.readFileSync(pathToPackage, 'utf8');
        this.packageJson = this.opts.packageJson = JSON.parse(rawPackageJson);
        this.pathToPackage = this.opts.pathToPackage = pathToPackage;
        say.succeed();
        done();
      }
      catch (e) {
        // If this fails, throw an error
        say.fail();
        done(new Error(errMsg + `Details: ${e.message}\n\n`));
      }
    },

    getInfoFromPackageIfExisting: function getInfoFromPackageIfExisting() {
      if (!this.isExisting || typeof (this.packageJson) !== "object") return;

      var done = this.async(),
          say = pxutil.spin('Getting details from package.json...'),
          errMsg = chalk.red(`\n!!! Necessary information is missing in ${this.pathToPackage}.\n\n\n\nIf you want to start a new module from scratch, don't run with the existing option. Otherwise, check your package.json and add missing details.`);;

      try {
        // Take specific details from the package.json object and add them to
        // `this` to use later.
        this.moduleName = this.opts.moduleName = this.packageJson.name;
        say.also(`name: ${this.moduleName}`);
        this.moduleType = this.opts.moduleType = this.moduleName.indexOf('-design') > -1 ? 'css' : 'component';
        say.also(`type: ${this.moduleType}`);
        this.moduleRepo = this.opts.moduleRepo = this.packageJson.repository.url || '';
        say.also(`repo URL: ${this.moduleRepo}`);
        this.moduleVersion = this.opts.moduleVersion = this.packageJson.version || '';
        say.also(`version: ${this.moduleVersion}`);
        this.moduleDescription = this.opts.moduleDescription = this.packageJson.description || '';
        say.also(`description: ${this.moduleDescription}`);
        say.succeed();
        done();
      }
      catch (e) {
        // If this fails, throw an error
        say.fail();
        done(new Error(errMsg + `Details: ${e.message}\n\n`));
      }
    },
  },

  prompting: {
    askModuleType: prompts.askModuleType,
    askModuleName: prompts.askModuleName,
    askWhichCssExistingTasks: prompts.askWhichCssExistingTasks,
    askForBumpMessage: prompts.askForBumpMessage
  },

  default: {
    importNeededGenerators: function importNeededGenerators() {
      var subgens = [];
      console.log(this.todos);
      this.todos.forEach(todo => {
        if (todo === 'css.boilerplate' && subgens.indexOf('px-comp:common-boilerplate') === -1) subgens.push('px-comp:common-boilerplate');
        if (todo === 'css.boilerplate' && subgens.indexOf('px-comp:css-boilerplate') === -1) subgens.push('px-comp:css-boilerplate');
        if (todo === 'css.demoify' && subgens.indexOf('px-comp:css-demo') === -1) subgens.push('px-comp:css-demo');
      });
      subgens.forEach(subgen => {
        this.composeWith(subgen);
      });
    }
  },

  end: {
    sayBye: function sayBye() {
      // this.log(`Name: ${this.moduleName}`);
      // this.log(`Type: ${this.moduleType}`);
      // this.log(`Package: ${JSON.stringify(this.packageJson,null,4)}`);
      // this.log(`Tasks: ${JSON.stringify(this.todos,null,4)}`);
      this.log(chalk.green(`\nFinished updates for ${this.moduleName}. Bye!`))
    }
  }
});
