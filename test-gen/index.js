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
    let polymerSelector;
    if(opts.polymerVersion === 'polymer1'){
      polymerSelector = "Polymer.dom(counterEl.root)";
    } else{
      polymerSelector = "counterEl.shadowRoot";
    }
    this.props.polymerSelector = polymerSelector;
  }

  writing() {
    this.props.varname = this._dashesToUnderscore(this.props.name);
    this.fs.copyTpl(
      this.templatePath('fixture-template.html'),
      this.destinationPath(`test/${this.props.name}-test-fixture.html`),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('custom-test-template.js'),
      this.destinationPath(`test/${this.props.name}-tests.js`),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('test/index.html'),
      this.props
    );
    this.fs.copy(
      this.templatePath('wct.conf-template.json'),
      this.destinationPath('wct.conf.json'),
      this.props
    );
  }

};
