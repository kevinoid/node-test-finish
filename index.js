import assert from 'assert';
import { randomUUID } from 'crypto';
import { createWriteStream, readFile } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { finished } from 'stream';

const testContents = [
  '# bad: v16.0.0-nightly20210216eec20ed5c1\ngit bisect bad eec20ed5c1\n',
  '# good: v16.0.0-nightly202102178353854ed7\ngit bisect good 8353854ed7\n',
  '# bad: v16.0.0-nightly202102189a2ac2c615\ngit bisect bad 9a2ac2c615\n',
];

export default function testFinish(cb) {
  const filename = path.join(tmpdir(), `${randomUUID()}.txt`);
  const ws = createWriteStream(filename);
  finished(ws, (errFinished) => {
    if (errFinished) {
      cb(errFinished);
      return;
    }

    readFile(filename, { encoding: 'utf8' }, (errRead, content) => {
      if (errRead) {
        cb(errRead);
        return;
      }

      try {
        assert.strictEqual(content, testContents.join(''));
      } catch (errEqual) {
        cb(errEqual);
        return;
      }

      cb();
    });
  });
  let i = 0;
  function loop() {
    ws.write(testContents[i]);
    i += 1;
    if (i < testContents.length) {
      setImmediate(loop);
    } else {
      ws.end();
    }
  }
  loop();
}
