/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


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
