const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  _dashesToUnderscore(inputString) {
    var inString = inputString || '';
    return inString.replace(/-/g, '_');
  }

  constructor(args, opts) {
    super(args, opts);
    this.props = {};
    this.props.name = opts.name;
    this.props.fixturename = `${opts.name}-fixture`;
  }

  writing() {
    this.props.varname = this._dashesToUnderscore(this.props.name);
    this.fs.copyTpl(
      this.templatePath('fixture-template.html'),
      this.destinationPath('test/' + this.props.name + '-test-fixture.html'),
      this.props
    );
    // this.fs.copyTpl(
    //   this.templatePath('base-test-template.js'),
    //   this.destinationPath('test/' + this.props.name + '-base-tests.js'),
    //   { tagname : this.props.name , varname : this.props.varname }
    // );
    this.fs.copyTpl(
      this.templatePath('custom-test-template.js'),
      this.destinationPath('test/' + this.props.name + '-custom-tests.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('wct.conf-template.json'),
      this.destinationPath('wct.conf.json'),
      this.props
    );
  }

};
