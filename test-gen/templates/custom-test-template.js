// This is the placeholder suite to place custom tests in
// Use testCase(options) for a more convenient setup of the test cases
suite('Custom Automation Tests for <%= name %>', () => {
  test('Check initial value of counter', done => {
    let counterEl = fixture('<%= fixturename %>'),
        counterValueEl = <%= polymerSelector %>.querySelector('span');
    debugger;
    assert.equal(counterValueEl.textContent, '0');
    done();
  });

  test('Clicking <%= name %> increments the counter', done => {
    let counterEl = fixture('<%= fixturename %>'),
        counterValueEl = <%= polymerSelector %>.querySelector('span');
    assert.equal(counterValueEl.textContent, '0');

    counterEl.click();
    flush(function(){
      assert.equal(counterValueEl.textContent, '1');
    });
    done();
  });
});
