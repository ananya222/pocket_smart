const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const babel = require('@babel/core');

const source = babel.transformSync(fs.readFileSync(`${__dirname}/googleLogin.js`, 'utf8'), {
  configFile: false, babelrc: false,
  plugins: ['@babel/plugin-transform-modules-commonjs'],
}).code;
const profileSource = babel.transformSync(fs.readFileSync(`${__dirname}/firebaseProfile.js`, 'utf8'), {
  configFile: false, babelrc: false,
  plugins: ['@babel/plugin-transform-modules-commonjs'],
}).code;

function setup({ platform = 'android', profile, cancelled = false, configured = true, error, firstError } = {}) {
  const calls = { writes: 0, auth: 0, playServices: 0, nativeLoads: 0 };
  const firebaseUser = { uid: 'user-1', displayName: 'Google Name', email: 'test@example.com' };
  const auth = Object.assign(() => ({ signInWithCredential: async () => {
    calls.auth++;
    if (firstError) {
      const thrown = firstError;
      firstError = null;
      throw thrown;
    }
    if (error) throw error;
    return { user: firebaseUser };
  } }), { GoogleAuthProvider: { credential: (token) => token } });
  let storedProfile = profile;
  const profileRef = {
    get: async () => ({ exists: !!storedProfile, data: () => storedProfile }),
  };
  const firestore = Object.assign(() => ({
    collection: () => ({ doc: () => profileRef }),
    runTransaction: async (callback) => callback({
      get: async () => ({ exists: !!storedProfile, data: () => storedProfile }),
      set: (_ref, value) => { calls.writes++; storedProfile = value; },
    }),
  }), { FieldValue: { serverTimestamp: () => 'timestamp' } });
  const mocks = {
    'react-native': { Platform: { OS: platform } },
    '../config': { auth, firestore },
    '../google-services.json': { client: [{
      client_info: { android_client_info: { package_name: 'com.pocketsmart.app' } },
      oauth_client: configured ? [{ client_type: 3, client_id: 'web-client' }] : [],
    }] },
    '@react-native-google-signin/google-signin': {
      GoogleSignin: {
        configure(options) { calls.configuration = options; },
        hasPlayServices: async () => { calls.playServices++; return true; }, signOut: async () => {},
        signIn: async () => cancelled ? { type: 'cancelled' } : { type: 'success', data: { idToken: 'token' } },
        getTokens: async () => ({ idToken: 'token', accessToken: 'access-token' }),
      },
      statusCodes: { SIGN_IN_CANCELLED: 'cancelled', IN_PROGRESS: 'progress', PLAY_SERVICES_NOT_AVAILABLE: 'unavailable' },
    },
  };
  const profileContext = {
    exports: {},
    require: (name) => {
      if (name === '../config') return mocks['../config'];
      throw new Error(`Unexpected profile dependency: ${name}`);
    },
  };
  vm.runInNewContext(profileSource, profileContext);
  mocks['./firebaseProfile'] = profileContext.exports;
  const context = { exports: {}, require: (name) => {
    if (name === '@react-native-google-signin/google-signin') calls.nativeLoads++;
    return mocks[name];
  }, setTimeout };
  vm.runInNewContext(source, context);
  return { run: context.exports.signInWithGoogle, calls };
}

test('new users receive a profile and need onboarding', async () => {
  const { run, calls } = setup();
  const user = await run();
  assert.equal(user.id, 'user-1');
  assert.equal(user.onboardingCompleted, false);
  assert.equal(calls.writes, 1);
  assert.equal(calls.playServices, 1);
});

test('iOS signs into Firebase and creates a profile without checking Play Services', async () => {
  const { run, calls } = setup({ platform: 'ios' });
  const user = await run();
  assert.equal(user.id, 'user-1');
  assert.equal(calls.auth, 1);
  assert.equal(calls.writes, 1);
  assert.equal(calls.playServices, 0);
  assert.equal(calls.configuration.webClientId, 'web-client');
});

test('iOS cancellation does not authenticate or create a profile', async () => {
  const { run, calls } = setup({ platform: 'ios', cancelled: true });
  assert.equal(await run(), null);
  assert.equal(calls.auth, 0);
  assert.equal(calls.writes, 0);
});

test('web rejects sign-in before loading the native SDK', async () => {
  const { run, calls } = setup({ platform: 'web' });
  await assert.rejects(run, /Android and iOS apps only/);
  assert.equal(calls.nativeLoads, 0);
  assert.equal(calls.auth, 0);
});
test('existing profile and onboarding are preserved', async () => {
  const profile = { fullName: 'Custom Name', onboardingCompleted: true, onboarding: { allowance: 500 } };
  const { run, calls } = setup({ profile });
  const user = await run();
  assert.equal(user.fullName, profile.fullName);
  assert.equal(user.onboarding, profile.onboarding);
  assert.equal(user.onboardingCompleted, true);
  assert.equal(calls.writes, 0);
});
test('cancellation does not authenticate or create a profile', async () => {
  const { run, calls } = setup({ cancelled: true });
  assert.equal(await run(), null);
  assert.equal(calls.auth, 0);
  assert.equal(calls.writes, 0);
});
test('missing OAuth configuration fails before authentication', async () => {
  const { run, calls } = setup({ configured: false });
  await assert.rejects(run, /setup is incomplete/);
  assert.equal(calls.auth, 0);
});
test('account conflicts direct users to the original login method', async () => {
  const { run, calls } = setup({ error: { code: 'auth/account-exists-with-different-credential' } });
  await assert.rejects(run, /original login method/);
  assert.equal(calls.writes, 0);
});
test('transient credential transport errors are retried once', async () => {
  const { run, calls } = setup({ firstError: { code: 'auth/unknown', message: 'SSL connection reset by peer' } });
  const user = await run();
  assert.equal(user.id, 'user-1');
  assert.equal(calls.auth, 2);
});
