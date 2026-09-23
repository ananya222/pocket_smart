const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');

const source = babel.transformSync(fs.readFileSync(`${__dirname}/appleLogin.js`, 'utf8'), {
  configFile: false,
  babelrc: false,
  plugins: ['@babel/plugin-transform-modules-commonjs'],
}).code;

function setup({ platform = 'android', error } = {}) {
  const calls = { popup: 0, profile: 0 };
  const firebaseUser = { uid: 'apple-user', displayName: null, email: 'relay@privaterelay.appleid.com' };
  class OAuthProvider {
    constructor(providerId) {
      this.providerId = providerId;
      this.scopes = [];
    }
    addScope(scope) { this.scopes.push(scope); return this; }
    setCustomParameters(parameters) { this.parameters = parameters; return this; }
  }
  const auth = Object.assign(() => ({
    signInWithPopup: async (provider) => {
      calls.popup++;
      calls.provider = provider;
      if (error) throw error;
      return { user: firebaseUser };
    },
  }), { OAuthProvider });
  const mocks = {
    'react-native': { Platform: { OS: platform } },
    '../config': { auth },
    './firebaseProfile': {
      ensureFirebaseProfile: async () => {
        calls.profile++;
        return { fullName: '', email: firebaseUser.email, onboardingCompleted: false };
      },
      toAppUser: (user, profile) => ({ id: user.uid, fullName: profile.fullName, email: profile.email, onboardingCompleted: profile.onboardingCompleted }),
    },
  };
  const context = { exports: {}, require: (name) => mocks[name] };
  vm.runInNewContext(source, context);
  return { run: context.exports.signInWithApple, calls };
}

test('Apple login configures the Firebase Apple provider and returns an app user', async () => {
  const { run, calls } = setup();
  const user = await run();
  assert.equal(user.id, 'apple-user');
  assert.equal(calls.provider.providerId, 'apple.com');
  assert.deepEqual(calls.provider.scopes, ['email', 'name']);
  assert.equal(calls.profile, 1);
});

test('Apple cancellation is treated as a normal no-op', async () => {
  const { run, calls } = setup({ error: { code: 'auth/popup-closed-by-user' } });
  assert.equal(await run(), null);
  assert.equal(calls.profile, 0);
});

test('Apple account conflicts explain that the existing provider must be used', async () => {
  const { run } = setup({ error: { code: 'auth/account-exists-with-different-credential' } });
  await assert.rejects(run, /original login method/);
});

test('Apple login is guarded to Android', async () => {
  const { run, calls } = setup({ platform: 'ios' });
  await assert.rejects(run, /Android only/);
  assert.equal(calls.popup, 0);
});
