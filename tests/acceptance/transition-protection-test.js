import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { currentSession, invalidateSession } from 'ember-simple-auth/test-support';
import { setupApplicationTest } from 'ember-qunit';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

module('Acceptance | transition protection', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.server.createList("user", 10)
    this.server.create("user", { email: "some@some.some", password: "some123" })

    await invalidateSession();
    await visit('/sign-in');


    await fillIn(`[data-test-reg-form-input="email"]`, "some@some.some");
    await fillIn(`[data-test-reg-form-input="password"]`, "some123");

    await click(`[data-test-reg-form-button="submit"]`)
  })

  test('it cant visit sign-in route if session is authenticated', async function (assert) {
    try {
      await visit('/sign-in');
    } catch (error) {
      assert.equal(currentURL(), '/user');
    }
  });

  test('it can visit sign-in route if session is unauthenticated', async function (assert) {
    await invalidateSession()

    await visit('/sign-in');
    assert.equal(currentURL(), '/sign-in');
  });

  test('it cant visit sign-up route if session is authenticated', async function (assert) {
    await visit('/sign-up');
    assert.equal(currentURL(), '/user');
  });

  test('it can visit sign-up route if session is unauthenticated', async function (assert) {
    await invalidateSession()

    await visit('/sign-up');
    assert.equal(currentURL(), '/sign-up');
  });

  test('it can visit user route if session is authenticated', async function (assert) {
    await visit('/user');
    assert.equal(currentURL(), '/user');
  });

  test('it cant visit user route if session is authenticated', async function (assert) {
    await invalidateSession()

    await visit('/user');
    assert.equal(currentURL(), '/sign-in');
  });
});
