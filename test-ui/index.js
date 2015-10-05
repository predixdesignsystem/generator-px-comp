'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var localUtil = require('./../util/index');
var exec = require('child_process').exec;

var UITestGenerator = module.exports = function UITestGenerator(args, options, config) {
    // By calling `NamedBase` here, we get the argument to the subgenerator call
    // as `this.name`.
    yeoman.generators.NamedBase.apply(this, arguments);

    if (options && options.subGen) {
        this.subGen = options.subGen;
        this.name = options.name;
        this.className = options.className;
        this.extName = options.extName;
        this.mixinNames = options.mixinNames;
    }

    console.log('You called the test-ui subgenerator.');

    this.on('end', function () {
        if (!options || !options.subGen) {
            console.log("Generator finished. Run 'grunt test' from the command line to run the tests...");
        }
    });
};

util.inherits(UITestGenerator, yeoman.generators.NamedBase);

UITestGenerator.prototype.askFor = function askFor() {

    if (!this.subGen) {

        var _this = this;

        var cb = this.async();

        // have Yeoman greet the user.
        console.log(chalk.yellow('\n\nAnswer the prompts below to scaffold functional tests for an existing Px component...\n\n'));

        var prompts = [

            {
                name: 'name',
                message: 'What would you like to name your component (must have a "-" in it)?',
                default: (this._.titleize(this.appname).indexOf("-") !== -1) ? this._.titleize(this.appname) : "px-" + this._.titleize(this.appname)
            }
        ];

        this.prompt(prompts, function (props) {
            this.name = _this._.slugify(_this.name);
            this.className = _this._.classify(_this.name);
            cb();
        }.bind(this));
    }
};

UITestGenerator.prototype.files = function files() {
    this.template('_spec.js', "test/" + this.name + "-spec.js", this);
    this.template('_fixture.html', 'test/fixture.html', this);
};

UITestGenerator.prototype.updateGrunt = function updateGrunt() {
    //localUtil.verifyGlobalPackage('web-component-tester', /*version*/"2.2.X", /*link*/true); //TBD once they get the install worked out.

    if (!this.subGen) {
        console.log(chalk.red('\n\nWe have not updated your Grunt file with testing tasks, you\'ll need to do that yourself using https://github.com/Polymer/web-component-tester as a guide...\n\n'));
    }
};
