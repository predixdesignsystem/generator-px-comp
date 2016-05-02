Px Component Generator
===============

## Introduction

The Px Component Generator is a starting point for building your own Predix UI Component. There are several technologies that we use to make working with components easier and to aid in automating builds.
Familiarize yourself with these tools (which we cover in the Technologies section further down the page) so your component can look and feel like everything else in the Predix UI ecosystem.  The Predix UI Component
Generator relies on [Yeoman](http://yeoman.io).

## Yeoman & Yeoman Generator

A generator is something run by [Yeoman](http://yeoman.io) to scaffold a software application, in this case a Predix UI component.  Yeoman
 is an application environment for writing and running generators. Yeoman lives in the [npm](https://npmjs.org) package repository when installed globally (-g).

```
$ npm install -g yo
```

_Note: This generator works in yo 1.2 and above. To find the version of yo on your system, type `$ npm list -g yo`_

You can think of a generator like a plug-in. `generator-px-comp` is a generator that scaffolds a Predix UI component

To install the Predix UI Component generator locally, clone this repository into generator-px-comp and then from the top level directory of this project, run

```
$ git clone https://github.com/PredixDev/generator-px-comp
$ cd generator-px-comp
$ npm link
```

Finally, initiate the generator from an empty directory to scaffold your new Px component

```
$ cd .. //cd up and out somewhere...anywhere outside the generator
$ mkdir px-something
$ cd px-something
$ yo px-comp
```

Running `yo px-comp` will ask you a few questions and then scaffold a sample component, which includes Gruntfile.js, package.json, bower.json, tests, etc in your directory.

Once you have a sample Predix UI component, you can...

```
//build css
$ grunt sass

//start a local server
$ grunt depserve

//nav in a browser to
localhost:8080
```

`grunt sass` compiles [Sass](http://sass-lang.com/) into CSS.

`grunt depserve` starts a simple node HTTP server that enables correct finding of bower dependencies for local runs.

After you've verified the component works, edit the sample Predix UI component, tests and dependencies that were scaffolded.

When your component is finished, commit it in Git and tag an initial release.

## Structure

It might seem like the generator creates quite a lot of files. Don't worry, most of them are packaged dependencies that aren't part of your Predix UI Component itself (i.e. the `node_modules` and `bower_components` directory).
The files that are part of the Px component are:

- **README.md** — A starter readme file in the Markdown format. Stash supports Markdown and we highly encourage you to write your documentation in it.
- **package.json** — An [npm](https://npmjs.org/) package file for specifying information and dependencies.
- **Gruntfile.js** — A build file for the [Grunt](http://gruntjs.com/) task runner.
- **bower.json** — A [Bower](http://bower.io/) package file for specifying information and dependencies.
- **.jshintrc** — [JSHint](http://www.jshint.com/) configuration file for managing JavaScript code quality.
- **<name>.html — the [component name].html
- **sass/** — All styles should go here. This folder contains [Sass](http://sass-lang.com/) stylesheets for 'sketch' and 'predix' styles. The 'predix' styles import 'sketch' and build upon them.
- **test/ui/** — All functional tests for the px-component go here... Also here is a test/ui/fixtures/index.html file which instances your new px-component on a page. It's used by the tests, but can also be used for ad-hoc viewing of your px-component.
- **test/unit/** — All JavaScript unit tests for the px-component go here...


## Requirements

A component **must** meet the following requirements to be considered part of the Predix UI ecosystem:

- Must provide a README
- Must provide an email address for support requests
- Must provide working examples in the test/ui/fixtures folder
- Must provide Sass that compiles down to regular CSS
- Must provide JavaScript unit tests.


## Tool Chain Reference

### npm

[npm](https://npmjs.org/) is a package manger for Node.js. We rely heavily on npm to install our grunt tasks, and also to install some of our tools like Bower and Grunt itself. If you've installed Node.js then npm should already be available on your system. Be sure to familiarize yourself with npm first and foremost as it is used throughout the component/Px landscape.

### Grunt

We use [Grunt](http://gruntjs.com/) to build all of our components and Design Extensions. Take some time to familiarize yourself with the [Grunt documentation.](http://gruntjs.com/)

The Component Seed comes with two built in grunt tasks: `grunt install` and simply `grunt`. The `grunt install` task will pull down all of your dependencies using Bower and generate a RequireJS config file for you. The basic `grunt` task will just attempt to compile all of your SASS files to CSS. Under the hood `grunt install` will call `grunt` as its final step, so you should only need to run `grunt` if you've made style changes post-install.

### Bower

[Bower](http://bower.io) is a package manager for the web, primarily focused on front-end JavaScript. We use bower to install all of our component dependencies and we would strongly encourage you to do the same. By using bower, teams are able to easily add your component to their project and update it as it is improved. Bower removes the need for a lot of manual copy/paste work which can lead to errors and generally eats up time.

### Sass

We request that all components provide their styles in [Sass](http://sass-lang.com/) format. This allows us to better leverage variables for color palettes, typography, etc. In this way components can have a consistent look and feel across all Px components. It also ensures that they have a known API to program against and they're not inventing things which won't work in
all systems.

By default the task will attempt to compile all Sass files in the `src/sass/` folder to individual stylesheets.


### RECOMMENDED READING

[Inuit CSS](https://github.com/inuitcss/getting-started) - Scalable and Modular Architecture for CSS

[Javascript the Good Parts](http://shop.oreilly.com/product/9780596517748.do) - Insights into Javascript by Douglas Crockford

---

## FAQ

### What does the tilde "~" mean in the version numbers?

The tilde is used to specify a version range. `~1.9.1` translates to "any version greater than or equal to 1.9.1 but less than 1.10.0".

Bower uses [Semantic Versioning (aka semver)](http://semver.org/) just like npm. [Here's a great explanation of all the ways you can specify version ranges in semver.](https://npmjs.org/doc/json.html#dependencies) Any component in the Design Extension ecosystem **must** use semantic versioning, otherwise tools like bower will be unable to consume it.


### I made changes to a component but bower keeps pulling down the old code

There are two things that can be going wrong in this situation.

1. You made code changes but you didn't create a new tag
2. You replaced an existing tag but didn't clear your bower cache


### When I run `bower install`, bower fetches megabytes or gigabytes of stuff...what's up with that?

Bower can fetch any git repository, whether or not the target repository provides a bower.json configuration file.
Many git repositories are not bower-optimized with an `ignore` block in bower.json to prevent a client project (e.g. your Predix UI Component) from getting all of the target dependency's test, docs, etc.  There are a few common strategies to deal with this, in order of preference:

1. Use an officially maintained, bower-optimized "shim" repository where possible.  Could be in github's ["shim"](https://github.com/components/components) area or a specific maintained fork of a given project, e.g. [requirejs](https://github.com/jrburke/requirejs-bower).
2. Use "ignore" in bower.json for Px-Components to hide our own unneeded files from downstream projects.
3. Point bower to an individual raw distribution file rather than an entire project repository if the entire runtime is in one or two files. Note that targeting a specific js file in a bower configuration will name that file `index.js` when fetched.
4. Make our own "shim" Stash repository with a devDependency (OpenLayers, DataTables).  Explanation: Make a separate Stash repository and for a 3rd party dependency and add the 3rd party as a "devDependency". Have a Grunt copy or build task to push only the runtime-necessary directories/files to a separate spot and check that in. Version the repository the same as the 3rd party dependency.  The "devDependency" itself will not be fetched by a downstream project during bower install if the "--production" flag is turned on, only the files resulting from the copy or build task will end up downstream. (This is our least favorite, but made 100% sense for OpenLayers as that requires a build step anyway…should only use this for big dependencies for which strategies 1-3 won't work).

#### You made code changes but you didn't create a new tag

Bower works off of tags, so if you add code to your component you have to version up the tag. This is why [semver](http://semver.org/) is so important. You want all those version numbers to mean something. If you haven't created a new tag **and pushed it to the remote server** then you won't see any changes.

To create a local tag:
``` bash
$ git tag v0.1.0
```

To push your local tags to your remote:
``` bash
$ git push origin --tags
```

To delete a local tag:
``` bash
$ git tag -d v0.1.0
```

To delete a tag on your remote:
``` bash
# WARNING! Make sure no one is using the tag! This is NOT recommended.
$ git push origin :/refs/tags/v0.1.0
```

#### You replaced an existing tag but didn't clear your bower cache

Perhaps you tagged something that was broken and needed to delete the tag locally and on your remote using the steps outlined above. Even after you've done this bower is still holding a cached instance of your library at the previous, bad tag. To tell bower to clear its cache use:

``` bash
# Will clear everything in bower's cache
$ bower cache-clean

# Will just clear the cache of your component
$ bower cache-clean <component>
```
After you've cleaned the cache it might also be a good idea to delete that component's folder from the `components` directory. Then you can try to run `grunt install` again.

## Running on an existing component

The `px-comp` has two "sub-generators" in it to scaffold tests, `px-comp:test-unit` and `px-comp:test-ui`. Both of these sub-generators are run when the full px-comp generator is run.
You may run the sub-generators individually on existing components that don't yet have automated tests:

```
$ cd my-existing-component
$ yo px-comp:test-unit
$ yo px-comp:test-ui
```

Sample tests will be generated. You'll need to edit the sample tests in order for them to pass, as the sample tests created by the generator assume
the component being tested is the sample Px component itself, not your existing component.  You'll also need to manually edit the Gruntfile.js and package.json to match the examples
in the `webdriver-support` and `karma-support` projects in order to pull in testing dependencies and enable the `grunt test` task.
