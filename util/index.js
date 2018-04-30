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

'use strict';

var exec = require('child_process').exec;

module.exports = {
    dependencyChoicesCss: [
        {name: 'Buttons', value: {bowerDev: '"px-meta-buttons-design": "^1.0.0",'}},
        {name: 'Lists', value: {bowerDev: '"px-meta-lists-design": "^1.0.0",'}},
        {name: 'Forms', value: {bowerDev: '"px-forms-design": "^2.0.0",'}},
        {name: 'Headings', value: {bowerDev: '"px-headings-design": "^1.0.0",'}},
        {name: 'Tables', value: {bowerDev: '"px-tables-design": "^2.0.0",'}},
        {name: 'Flexbox Layout', value: {bowerDev: '"px-layout-design": "^1.0.0",'}},
        {name: 'Toggle Switch', value: {bowerDev: '"px-toggle-design": "^2.0.0",'}},
        {name: 'Content Box', value: {bowerDev: '"px-box-design": "^1.0.0",'}},
        {name: 'Code Snippets Styling', value: {bowerDev: '"px-code-design": "^2.0.0",'}},
        {name: 'Flag/Media Object', value: {bowerDev: '"px-flag-design": "^1.0.0",'}}
    ],

    dependencyChoicesTest: [
    ],

    resolveDependencies: function resolveDependencies(dependencies, type) {
        var resolved = [], i, dep;
        if (dependencies) {
            for (i = 0; i < dependencies.length; i++) {
                dep = dependencies[i].value || dependencies[i];
                if (dep[type]) {
                    resolved.push(dep[type]);
                }
            }
        }
        return resolved;
    },

    verifyGlobalPackage: function(pkgName, version, link) {
        var resolvedPkgName = version ? pkgName + '@' + version : pkgName;
        console.log('Verifying ' + resolvedPkgName + '...');
        exec('npm list -g ' + resolvedPkgName + ' --depth=0', function(err, stdout, stderr) {
            console.log(stdout);
            if (stdout.indexOf('(empty)') !== -1) {
                console.log('Installing ' + resolvedPkgName + '...');
                exec('npm install -g ' + resolvedPkgName, function(err, stdout, stderr) {
                    console.log(stdout);
                    if (link) {
                        exec('npm link ' + pkgName, function(err, stdout, stderr) {
                            console.log(stdout);
                        });
                    }
                });
            }
            else {
                if (link) {
                    exec('npm link ' + pkgName, function(err, stdout, stderr) {
                        console.log(stdout);
                    });
                }
            }
        });
    }
};
