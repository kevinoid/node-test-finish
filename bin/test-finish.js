#!/usr/bin/env node

import assert from 'assert';
import testFinish from '../index.js';

let i = 0;
function loop() {
  testFinish((err) => {
    assert.ifError(err);
    if (i < 1024) {
      i += 1;
      loop();
    }
  });
}
loop();
