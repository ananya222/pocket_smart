const fs = require('node:fs');
const path = require('node:path');
const { withAppDelegate } = require('@expo/config-plugins');

const start = '// @generated begin pocketsmart-shortcut-import';
const end = '// @generated end pocketsmart-shortcut-import';

function installShortcutSource(contents, projectRoot) {
  const parser = fs.readFileSync(path.join(projectRoot, 'services/smsExpenses.js'), 'utf8')
    .replace('export function parseExpenseSms', 'function parseExpenseSms');
  const swift = fs.readFileSync(path.join(__dirname, 'ios-shortcut-import.swift'), 'utf8')
    .replace('__POCKETSMART_PARSER_BASE64__', Buffer.from(parser).toString('base64'));
  const existingStart = contents.indexOf(start);
  if (existingStart !== -1) {
    const existingEnd = contents.indexOf(end, existingStart);
    if (existingEnd === -1) throw new Error('Incomplete PocketSmart Shortcut source block.');
    contents = contents.slice(0, existingStart) + contents.slice(existingEnd + end.length);
  }
  return `${contents.trimEnd()}\n\n${start}\n${swift.trimEnd()}\n${end}\n`;
}

module.exports = (config) => withAppDelegate(config, (config) => {
  if (config.modResults.language !== 'swift') throw new Error('PocketSmart Shortcuts requires a Swift AppDelegate.');
  config.modResults.contents = installShortcutSource(config.modResults.contents, config.modRequest.projectRoot);
  return config;
});
module.exports.installShortcutSource = installShortcutSource;
