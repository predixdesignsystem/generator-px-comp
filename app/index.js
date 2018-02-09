const Generator = require('yeoman-generator');
const chalk = require('chalk');
const s = require('underscore.string');
const localUtil = require('./../util/index');
const mkdirp = require('mkdirp');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : chalk.yellow(`\n\nHello! Answer the prompts to scaffold a Predix UI component.
The generated component itself is not fancy (it makes a line on the screen that increments a counter when clicked),
but contains the Bower config, gulpfile, tests, etc. common to all Predix UI components...\n\n`) +
`What is the component\'s name, must have a "-", e.g. \'px-thing\'?'`,
      default : (s(this.appname).slugify().value().indexOf('-') !== -1) ? s(this.appname).slugify().value() : 'px-' + s(this.appname).slugify().value()
    }, {
      type : 'list',
      name: 'polymerVersion',
      message: 'Would you like to create a Polymer 1.x/2.x hybrid component, or a Polymer 2.x only component?',
      choices: [{name: 'Polymer 1.x/2.x hybrid', value: 'polymer1'},{name: 'Polymer 2.x', value: 'polymer2'}]
    }, {
      type: 'checkbox',
      name: 'cssDependencies',
      message: 'Which of these common Sass modules does your component need? (You can add more later in bower.json)',
      choices: localUtil.dependencyChoicesCss
    }
  ]).then(props => {
      props.name = s(props.name).slugify().value();
      props.camelName = s(props.name).camelize().value();
      props.objName = s(props.name).slugify().value();
      props.className = s(props.name).classify().value();
      props.extName = null;
      props.extending = props.extending;
      props.repoUrl = 'https://github.com/PredixDev/' + s(props.name).slugify().value() + '.git';
      props.dependencies = localUtil.resolveDependencies(localUtil.dependencyChoices_, 'bower');
      props.devDependencies = localUtil.resolveDependencies(localUtil.dependencyChoices_, 'bowerDev');

      if (props.polymerVersion === 'polymer1'){
        props.polymerBowerVersion = '#1.9 - 2';
      } else{
        props.polymerBowerVersion = '^2.0.0';
      }

      if (props.cssDependencies.length > 0) {
        Array.prototype.push.apply(props.devDependencies, localUtil.resolveDependencies(props.cssDependencies, 'bowerDev')); //merge in css stuff
      }

      Array.prototype.push.apply(props.devDependencies, localUtil.resolveDependencies(localUtil.dependencyChoicesTest, 'bowerDev')); //merge in test stuff

      if (props.extending) {
        try {
          var fileName = fs.existsSync(path.resolve(props.extending + '/package.json')) ? '/package.json' : '/bower.json';
          props.extPkg = JSON.parse(require('html-wiring').readFileAsString(props.extending + fileName));
          props.extName = props.extPkg.name;
          props.extObjName = s(props.extName).slugify().value();
          props.extRepo = props.extPkg.repository ? props.extPkg.repository.url : 'https://github.com/change-this-in-bower.json-please.git';
        } catch (e) {
          throw new Error('If extending an existing component, the given directory of that component must be local, and contain a \'package.json\' and \'repository: {url : ...}\' entries. ' + e.message);
        }
        props.dependencies.push('"' + props.extName + '": "' + props.extRepo + '"'); //merge in extends stuff
      }
      this.props = props;
    });
  };

  writing() {
    mkdirp('sass');
    mkdirp('test');
    mkdirp('.github');
    if (this.props.polymerVersion === 'polymer1'){
      this.fs.copyTpl(
        this.templatePath('src/_component-polymer1.html'),
        this.destinationPath(`${this.props.name}.html`),
        this.props
      );

    }else{
      this.fs.copyTpl(
        this.templatePath('src/_component-polymer2.html'),
        this.destinationPath(`${this.props.name}.html`),
        this.props
      );
    }
    this.fs.copyTpl(
      this.templatePath('src/_component.scss'),
      this.destinationPath(`sass/${this.props.name}.scss`),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('doc/_index.html'),
      this.destinationPath('index.html'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('doc/demo/_index.html'),
      this.destinationPath(`demo/${this.props.name}-demo.html`),
      this.props
    );

    this.fs.copy(
      this.templatePath('jshintrc'),
      this.destinationPath('.jshintrc')
    );
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('bowerrc'),
      this.destinationPath('.bowerrc')
    );
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('LICENSE.md'),
      this.destinationPath('LICENSE.md')
    );
    this.fs.copy(
      this.templatePath('src/.github/PULL_REQUEST_TEMPLATE.md'),
      this.destinationPath('.github/PULL_REQUEST_TEMPLATE.md')
    );
    this.fs.copy(
      this.templatePath('src/.github/ISSUE_TEMPLATE.md'),
      this.destinationPath('.github/ISSUE_TEMPLATE.md')
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
      this.templatePath('.travis.yml'),
      this.destinationPath('.travis.yml')
    );
    this.fs.copy(
      this.templatePath('monogram-wdmk.png'),
      this.destinationPath('monogram-wdmk.png')
    );

    let context = {
        titleize: s.titleize,
        name: this.props.name
    };

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_favicon.ico'),
      this.destinationPath('favicon.ico'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_README.md'),
      this.destinationPath('README.md'),
      context
    );
    this.fs.copyTpl(
      this.templatePath('_HISTORY.md'),
      this.destinationPath('HISTORY.md'),
      this.props
    );

    this.fs.copyTpl(
      this.templatePath('_gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      this.props
    );

  };

  install(){
    this.bowerInstall();
    this.yarnInstall();
  };

  end() {
    let subGenOptions = {
        subGen: true,
        name: this.props.name,
        objName: this.props.objName,
        extending: this.props.extending,
        dependencies: this.props.dependencies,
        extName: this.props.extName,
        mixinNames: this.props.mixinNames,
        polymerVersion: this.props.polymerVersion
    };

    this.composeWith(require.resolve('../test-gen'), subGenOptions);
    console.log('Generator finished. Running \'gulp\' to show you the API docs and demo pages...');
    this.spawnCommand('gulp');
    this.spawnCommand('gulp', ['serve']);
  };

};
