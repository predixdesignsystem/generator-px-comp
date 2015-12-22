// This will be an automatically-generated variable based on the component
// name provided to the pxtestkit yeoman generator
var <%= varname %>;

// This is the bootstrapping function that will run the base and custom tests
// upon the completion of web components construction by Polymer
document.addEventListener("WebComponentsReady", function() {
  runBaseTests();
  runCustomTests();
});

// This is a utility/wrapper function for the test() function of
// web-component-tester;  the developer can use this to specify tests
// through a configuration object instead of repeatedly writing the test
// case construction and assertion code patterns
/**
 *
 * testCase(options) :
 * Utility wrapper for web-component-tester's test() function to perform the
 * most common test cases.  Accepts a configuration object that determines
 * how test() will be called (e.g., synchronously/asynchronously, event string
 * to use, etc). Each call to testCase corresponds to exactly 1 call to test().
 *
 * options : test configuration object that accepts the following properties
 *
 *   description : optional
 *   The description for the test case
 *
 *   root : required
 *   The innermost HTML node which is ancestor to any and all nodes that are
 *   involved in the test case. root can be specified either as a CSS selector
 *   string or an HTMLElement.  For the former case, the element located by
 *   document.querySelector(root) will be used.
 *
 *   eventSource : optional
 *   The element from which the specified event will be dispatched.  eventSource
 *   can be specified either as a CSS selector string or an HTMLElement.  For
 *   the former case, the element located by root.querySelector(eventSource)
 *   will be used to dispatch the event from.  This means that if eventSource
 *   was specified as a CSS selector string, the event will be dispatched from
 *   and element that is a descendant of root.  For eventSource specified as
 *   an HTML element, the event source element can be any element in the DOM,
 *   and not necessarily a descendant of root.
 *
 *   event : optional
 *   The event string for the event that will be dispatched from event source.
 *   Specifying the event string will run the test() function asynchronously
 *   (i.e., callback will have the 'done' parameter used by Mocha in
 *   asynchronous test cases).
 *
 *   modifyFunction : optional
 *   A function that will be called before the event is dispatched, for an
 *   asynchronous test.  The developer can use modifyFunction to perform
 *   anything such as modifying the DOM to set up the test.  modifyFunction is
 *   presently guaranteed to work only synchronously (i.e., no event or timer
 *   callbacks involved).
 *
 *   assertFunction :
 *   The assertion function that will used to test the case.  This function
 *   must return true or false.
**/

function testCase(options) {
  var testDescription, rootElement, eventSource, eventString, modifyFunction, assertFunction;
  var isAsync = false;
  function _failTest(message) {
    test(message, function() {
      assert.isTrue(false);
    });
  }
  if (typeof options === 'object') {
    testDescription = options['description'] || 'No test description provided';
    rootElement = options['root'] || document;
    eventSource = options['eventSource'] || '';
    eventString = options['event'] || '';
    modifyFunction = options['modifyFunction'];
    assertFunction = options['assertFunction'] || function() { return true; };
  }
  // fail the test if options was not provided
  else {
    _failTest(testDescription + ' Invalid test spec');
    return;
  }

  function _deriveRoot() {
    if (typeof rootElement === 'string') {
      rootElement = document.querySelector(rootElement);
    }
  }

  // if test is asynchronous (i.e., event was provided)
  if (eventString !== '') {
    isAsync = true;
  }
  // at this point eventSource is guaranteed to be an HTML element
  if (isAsync) {
    test(testDescription, function(done) {
      _deriveRoot();
      if (!(rootElement instanceof HTMLElement) && !(rootElement instanceof HTMLDocument)) {
        assert.isTrue(false);
        done();
        return;
      }
      if ( !(eventSource instanceof HTMLElement) &&
           !(typeof eventSource === 'string') ) {
        assert.isTrue(false);
        done();
        return;
      }
      if (typeof eventSource === 'string') {
        eventSource = rootElement.querySelector(eventSource);
      }
      if (eventSource === null) {
        assert.isTrue(false);
        done();
        return;
      }
      eventSource.addEventListener(eventString, function() {
        setTimeout(function() {
          assert.isTrue(assertFunction(rootElement));
          done();
        }, 50);
      });
      if (modifyFunction instanceof Function) {
        modifyFunction(rootElement);
      }
      eventSource.dispatchEvent(new Event(eventString));
    })
  }
  else {
    test(testDescription, function() {
      _deriveRoot();
      if (!(rootElement instanceof HTMLElement) && !(rootElement instanceof HTMLDocument)) {
        assert.isTrue(false);
        return;
      }
      assert.isTrue(assertFunction(rootElement));
    })
  }
}

// Wrapper for base automation tests.  This function is automatically
// generated by the pxtestkit yeoman generator
function runBaseTests() {
  <%= varname %> = document.getElementById('<%= varname %>');

  suite('Base Automation Tests for Data Table', function() {

    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
    test('<%= varname %> fixture is created', function() {
      assert.isTrue(document.getElementById('<%= varname %>') !== null);
    });

  });
};
