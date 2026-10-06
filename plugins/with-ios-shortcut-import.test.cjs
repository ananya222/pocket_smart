const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const { installShortcutSource } = require('./with-ios-shortcut-import');

test('Shortcut source installs once and embeds the runnable shared parser', () => {
  const root = path.resolve(__dirname, '..');
  const source = installShortcutSource('import Expo\nclass AppDelegate {}\n', root);
  assert.equal(installShortcutSource(source, root), source);
  assert.equal((source.match(/struct ImportTransactionMessageIntent/g) || []).length, 1);
  const encoded = source.match(/Data\(base64Encoded: "([A-Za-z0-9+/=]+)"\)/)[1];
  const parse = vm.runInNewContext(`${Buffer.from(encoded, 'base64').toString()}\nparseExpenseSms`);
  const [expense] = parse([{ body: 'INR 250 debited from account XX1234 at TEST Cafe on 05-Oct-2026.', date: Date.UTC(2026, 9, 5), sourceId: 'test' }]);
  assert.equal(expense.amount, -250);
  assert.equal(expense.title, 'TEST Cafe');
  assert.equal(expense.body, undefined);
  assert.equal(parse([{ body: 'OTP 123456 for INR 250 purchase', date: Date.now() }]).length, 0);
});
