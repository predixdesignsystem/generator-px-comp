'use strict';

var exec = require('child_process').exec;

module.exports = {

    dependencyChoicesCss: [
        {name: "Buttons", value: {bowerDev: "\"px-meta-buttons-design\": \"~0.5.5\","}},
        {name: "Lists", value: {bowerDev: "\"px-meta-lists-design\": \"~0.3.4\","}},
        {name: "Forms", value: {bowerDev: "\"px-forms-design\": \"~0.3.16\","}},
        {name: "Headings", value: {bowerDev: "\"px-headings-design\": \"~0.2.13\","}},
        {name: "Tables", value: {bowerDev: "\"px-tables-design\": \"~0.3.13\","}},
        {name: "Flexbox Layout", value: {bowerDev: "\"px-layout-design\": \"~0.3.13\","}},
        {name: "Toogle Switch", value: {bowerDev: "\"px-toggle-design\": \"~0.2.12\","}},
        {name: "Content Box", value: {bowerDev: "\"px-box-design\": \"~0.3.13\","}},
        {name: "Code Snippets Styling", value: {bowerDev: "\"px-code-design\": \"~0.2.11\","}},
        {name: "Input Groups", value: {bowerDev: "\"px-input-group-design\": \"~0.2.12\","}},
        {name: "Flag/Media Object", value: {bowerDev: "\"px-flag-design\": \"~0.2.12\","}}
    ],

    dependencyChoicesTest: [
        //{name: 'wct', value: {bowerDev: "\"web-component-tester\": \"~2.2.6\""}}
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
        var resolvedPkgName = version ? pkgName + "@" + version : pkgName;
        console.log("Verifying " + resolvedPkgName + "...");
        exec('npm list -g ' + resolvedPkgName + ' --depth=0', function(err, stdout, stderr) {
            console.log(stdout);
            if (stdout.indexOf("(empty)") !== -1) {
                console.log("Installing " + resolvedPkgName + "...");
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
