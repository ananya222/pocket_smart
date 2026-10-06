const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(`${__dirname}/smsExpenses.js`, 'utf8').replace('export function', 'function');
const parse = vm.runInNewContext(`${source}\nparseExpenseSms`);
const message = (body, sourceId = 'test-id') => ({ body, sourceId, date: Date.UTC(2026, 9, 1) });
test('transaction SMS becomes a reviewable expense without carrying message text', () => {
  const [item] = parse([message('INR 1,234.50 debited from A/c XX1234 at TEST Cafe on 01-Oct-2026.')]);
  assert.equal(item.amount, -1234.5);
  assert.equal(item.title, 'TEST Cafe');
  assert.equal(item.category, 'Food & Drinks');
  assert.equal(item.sourceId, 'test-id');
  assert.equal(item.body, undefined);
  assert.equal(item.sender, undefined);
});
test('ignore OTPs, refunds, failed payments, credits and invalid transactions', () => {
  for (const body of ['OTP 123456 for transaction INR 500.', 'INR 500 credited to your account.', 'Refund INR 500 for purchase.', 'Payment of INR 500 failed.', 'Purchase at TEST Cafe.', 'INR 0 paid to TEST Cafe.', 'Hello, how are you?']) assert.equal(parse([message(body)]).length, 0, body);
  assert.equal(parse([{ ...message('INR 500 paid to TEST Cafe.'), date: 'invalid' }]).length, 0);
});
