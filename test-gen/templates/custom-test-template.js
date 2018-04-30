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
