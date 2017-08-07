'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var localUtil = require('./../util/index');
var exec = require('child_process').exec;
var s = require('underscore.string');
var mkdirp = require('mkdirp');


var PxComponentGenerator = module.exports = function PxComponentGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    var _this = this;

    var skipInstall = options['skip-install'];

    this.on('end', function () {

        var subGenOptions = {
            subGen: true,
            name: _this.name,
            objName: _this.objName,
            extending: _this.extending,
            dependencies: _this.dependencies,
            extName: _this.extName,
            mixinNames: _this.mixinNames
        };

        //if (_this.testing) {
            this.composeWith('px-comp:test-gen', {options: subGenOptions, args: [_this.name], 'skip-install': true});
        //}

        _this.installDependencies({ skipInstall: skipInstall, callback: function () {
                console.log('Generator finished. Running \'gulp\' to show you the API docs and demo pages...');
                _this.spawnCommand('gulp');
                _this.spawnCommand('gulp', ['serve']);
            }
        });
    });

    this.pkg = JSON.parse(require('html-wiring').readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(PxComponentGenerator, yeoman.generators.Base);

PxComponentGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(chalk.yellow('\n\nHello! Answer the prompts to scaffold a Predix UI component.\n'));
    console.log(chalk.yellow('The generated component itself is not fancy (it makes a line on the screen that increments a counter when clicked),'));
    console.log(chalk.yellow('but contains the Bower config, gulpfile, tests, etc. common to all Predix UI components...\n\n'));

    var prompts = [
        {
            name: 'name',
            message: 'What is the component\'s name, must have a "-", e.g. \'px-thing\'?',
            default: (s(this.appname).slugify().value().indexOf('-') !== -1) ? s(this.appname).slugify().value() : 'px-' + s(this.appname).slugify().value()
        },
        {
            name: 'mixins',
            message: 'Optional: Local paths to Polymer behaviors the component uses, comma-separated (e.g. \'../px-my-mixin,../px-my-other-mixin\')',
            default: null
        },
        {
            type: 'checkbox',
            name: 'cssDependencies',
            message: 'Which of these common Sass modules does your component need? (You can add more later in bower.json)',
            choices: localUtil.dependencyChoicesCss
        }
    ];

    this.prompt(prompts, function (props) {
        this.name = s(props.name).slugify().value();
        this.camelName = s(props.name).camelize().value();
        this.objName = s(props.name).slugify().value();
        this.mixins = props.mixins ? props.mixins.split(',') : null;
        this.mixinNames = props.mixins ? [] : null;
        this.extName = null;
        this.extending = props.extending;
        this.repoUrl = 'https://github.com/PredixDev/'  + s(props.name).slugify().value() + '.git';
        this.dependencies = localUtil.resolveDependencies(localUtil.dependencyChoices_, 'bower');
        this.devDependencies = localUtil.resolveDependencies(localUtil.dependencyChoices_, 'bowerDev');

        if (props.cssDependencies.length > 0) {
            Array.prototype.push.apply(this.devDependencies, localUtil.resolveDependencies(props.cssDependencies, 'bowerDev'));//merge in css stuff
        }

        Array.prototype.push.apply(this.devDependencies, localUtil.resolveDependencies(localUtil.dependencyChoicesTest, 'bowerDev'));//merge in test stuff

        if (this.mixins) {
            try {
                var _this = this;
                this.mixins.forEach(function(mixin) {
                    var fileName = fs.existsSync(path.resolve(mixin + '/package.json')) ? '/package.json' : '/bower.json';
                    var mixinPkg = JSON.parse(require('html-wiring').readFileAsString(mixin + fileName));
                    _this.mixinNames.push(mixinPkg.name);
                    var mixinRepoUrl = mixinPkg.repository ? mixinPkg.repository.url : 'https://github.com/change-this-in-bower.json-please.git';
                    _this.dependencies.push('"' + mixinPkg.name + '": "' + mixinRepoUrl + '"'); //merge in mixin stuff
                });
            }
            catch(e) {
                throw new Error('If mixing in a library, the given directory of that library must be local, and contain a \'package.json\' with a \'repository: {url : ...}\' entry. ' + e.message);
            }
        }

        if (this.extending) {
            try {
                var fileName = fs.existsSync(path.resolve(this.extending + '/package.json')) ? '/package.json' : '/bower.json';
                this.extPkg = JSON.parse(require('html-wiring').readFileAsString(this.extending + fileName));
                this.extName = this.extPkg.name;
                this.extObjName = s(this.extName).slugify().value();
                this.extRepo = this.extPkg.repository ? this.extPkg.repository.url : 'https://github.com/change-this-in-bower.json-please.git';
            }
            catch(e) {
                throw new Error('If extending an existing component, the given directory of that component must be local, and contain a \'package.json\' and \'repository: {url : ...}\' entries. ' + e.message);
            }
            this.dependencies.push('"' + this.extName + '": "' + this.extRepo + '"'); //merge in extends stuff
        }

        cb();
    }.bind(this));
};

PxComponentGenerator.prototype.app = function app() {

    mkdirp('sass');
    mkdirp('test');
    mkdirp('.github');
    mkdirp('scripts');

    this.template('src/_component-polymer1.html', this.name + '.html', this);
    this.template('src/_component-polymer1.es6.js', `${this.name}.es6.js`, this);
    this.template('src/_component.scss', 'sass/' + this.name + '.scss', this);
};

PxComponentGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('bowerrc', '.bowerrc');
    this.copy('editorconfig', '.editorconfig');
    this.copy('LICENSE.md', 'LICENSE.md');
    this.copy('src/.github/PULL_REQUEST_TEMPLATE.md', '.github/PULL_REQUEST_TEMPLATE.md');
    this.copy('src/.github/ISSUE_TEMPLATE.md', '.github/ISSUE_TEMPLATE.md');
    this.copy('scripts/ghp.sh', 'scripts/ghp.sh');
    this.copy('CONTRIBUTING.md', 'CONTRIBUTING.md');
    this.copy('OSS_Notice.pdf', 'OSS_Notice.pdf');
    this.copy('.travis.yml', '.travis.yml');
    this.copy('monogram-wdmk.png', 'monogram-wdmk.png');
    this.copy('babelrc', '.babelrc');

    this.template('doc/_index.html', 'index.html', this);
    this.template('doc/demo/_index.html', `demo/${this.name}-demo.html`, this);

    var context = {
        titleize: s.titleize,
        name: this.name
    };

    this.template('_package.json', 'package.json', this);
    this.template('_favicon.ico', 'favicon.ico', this);
    this.template('_README.md', 'README.md', context);
    this.template('_HISTORY.md', 'HISTORY.md', this);
};

PxComponentGenerator.prototype.runtime = function runtime() {
    this.template('_gulpfile.js', 'gulpfile.js', this);
    this.template('_bower.json', 'bower.json', this);
};
