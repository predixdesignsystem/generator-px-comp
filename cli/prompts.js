'use strict';

var chalk = require('chalk');

module.exports = {
  askModuleType,
  askModuleName,
  askWhichCssExistingTasks,
  askForBumpMessage
}

function askModuleType() {
  // Only ask if this isn't an existing module, and if we don't have a moduleType
  if (this.isExisting || this.moduleType.length) return;

  var done = this.async();

  this.prompt({
    type: 'list',
    name: 'moduleType',
    message: "What type of Predix UI module would you like?",
    choices: [
      { value: 'component',
        name: 'Component (a dynamic webcomponent built with Polymer)'
      },
      { value: 'css',
        name: 'CSS (a module defining CSS styles, written in Sass)'
      }
    ],
    default: 'component'
  })
  .then((prompt) => {
    this.moduleType = this.opts.moduleType = prompt.moduleType;
    done();
  });
};

function askModuleName() {
  // Only ask if this isn't an existing module, and if we don't have a moduleName
  // Abort if we don't have a moduleType
  if (this.isExisting || this.moduleName.length || !this.moduleType.length) return;

  var done = this.async();

  this.prompt({
    type: 'input',
    name: 'moduleName',
    message: (response) => {
      return 'What is the name of your module?' +
        (this.moduleType === "component" ? '\nComponent module names should follow the format px-' + chalk.yellow('NAME') : '') +
        (this.moduleType === "css" ? '\nCSS module names should follow the format px-' + chalk.yellow('NAME') + '-design.' : '');
    },
    default: ''
  })
  .then((prompt) => {
    this.moduleName = this.opts.moduleName = prompt.moduleName;
    done();
  });
};

function askWhichCssExistingTasks() {
  // Only ask if this is an existing module and we have a name/type
  if (!this.isExisting || !this.moduleName.length || !this.moduleType.length || this.moduleType !== "css") return;

  var done = this.async();

  this.log(`
${chalk.bold('* I found the following information about this module:')}
  - name: ${chalk.blue(this.moduleName)}
  - type: ${chalk.blue(this.moduleType)}
  - version: ${chalk.blue(this.moduleVersion)}
  - description: ${chalk.blue(this.moduleDescription)}
    `)

  this.prompt({
    type: 'checkbox',
    name: 'cssExistingTasks',
    message: 'What tasks would you like to run? Pick as many as you want. Scroll to see more.',
    choices: [
      { value: 'css.depcheck',
        name: 'Check dependencies and update if necessary'
      },
      { value: 'css.boilerplate',
        name: 'Update module boilerplate files'
      },
      { value: 'css.bump',
        name: 'Bump module version after changes'
      },
      { value: 'css.demoify',
        name: 'Add a demo page and other dependencies'
      },
      { value: 'css.ghp',
        name: 'Configure Github pages for module'
      }
    ]
  })
  .then((prompt) => {
    if (prompt.cssExistingTasks.length > 0) {
      prompt.cssExistingTasks.forEach((task) => { this.opts.todos.push(task) });
      this.todos = this.opts.todos;
    }
    done();
  });
};

function askForBumpMessage() {
  // Only ask if this is an existing css module, and we're running bump task
  // if (!this.isExisting || !this.moduleName.length || !this.moduleType.length || this.moduleType !== "css" || !this.todos.length || this.todos.indexOf('css.bump') === -1) return;
  // @TODO Implement this
  return;

  var done = this.async();

  this.prompt({
    type: 'input',
    name: 'bumpMessage',
    message: 'What message do you want to add to HISTORY.md for this patch? Seperate lines with |',
    default: ''
  })
  .then((prompt) => {
    this.moduleName = this.opts.moduleName = prompt.moduleName;
    done();
  });
};
