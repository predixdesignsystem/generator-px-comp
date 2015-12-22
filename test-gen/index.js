var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  _dashesToUnderscore: function(inputString) {
    inString = inputString || '';
    return inString.replace(/-/g, '_');
  },

  constructor: function() {
    generators.Base.apply(this, arguments);

    this.config.save();

    this.argument('tagname', {
      desc: 'The HTML tag name of the component to generate tests for',
      type: String,
      required: true
    });
  },

  writing: function() {
    this.varName = _dashesToUnderscore(this.tagname);
    this.fs.copyTpl(
      this.templatePath('fixture-template.html'),
      this.destinationPath('test/' + this.tagname + '-test-fixture.html'),
      { tagname : this.tagname , varname : this.varName }
    );
    this.fs.copyTpl(
      this.templatePath('base-test-template.js'),
      this.destinationPath('test/' + this.tagname + '-base-tests.js'),
      { tagname : this.tagname , varname : this.varName }
    );
    this.fs.copyTpl(
      this.templatePath('custom-test-template.js'),
      this.destinationPath('test/' + this.tagname + '-custom-tests.js'),
      { tagname : this.tagname , varname : this.varName }
    );
    this.fs.copyTpl(
      this.templatePath('wct.conf-template.js'),
      this.destinationPath('wct.conf.js'),
      { tagname : this.tagname , varname : this.varName }
    );
  }

});
