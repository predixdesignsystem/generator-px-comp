'use strict';

/*
 * Copyright (c) 2013 GE Global Research. All rights reserved.
 *
 * The copyright to the computer software herein is the property of
 * GE Global Research. The software may be used and/or copied only
 * with the written permission of GE Global Research or in accordance
 * with the terms and conditions stipulated in the agreement/contract
 * under which the software has been supplied.
 */

/**
 * @class UI test spec.
 *
 * @author Jeff Reichenberg
 *
 * TODO: make a selenium "PageObject" out of the component to provide an interface to expected behavior
 */

var webdriver = require('webdriver-support/node_modules/selenium-webdriver'),
    chai = require('chai'),
    webdriverFactory = require('webdriver-support');

var driver, driverSession;

chai.use(require('chai-as-promised'));

before(function() {
    driverSession = webdriverFactory.create();
    driver = driverSession.setup({spec: __filename});
});

after(function(done) {
    driverSession.teardown(done);
});

afterEach(function (done) {
    driverSession.logState(this.currentTest, done);
});

describe('Instancing component from provided DOM data attribute', function () {

    before(function() {
        driver.get('fixture.html?dom=shady');
        return driver.wait(webdriver.until.elementLocated(webdriver.By.css("<%= name %> .circle")), 3000);
    });

    it('should instance a px-app-nav from the expected DOM', function () {
        return chai.expect(
            driver.findElement(webdriver.By.css("<%= name %>"))
        ).to.eventually.exist;
    });
});

