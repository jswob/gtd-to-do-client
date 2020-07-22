import { module, test } from 'qunit';
import { visit, fillIn, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { currentSession, authenticateSession, invalidateSession } from 'ember-simple-auth/test-support';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';

// This is testing file for testing user network interactions via ember-cli-mirage
module('Acceptance | user', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it can sign_in user and create session', async function (assert) {
    this.server.createList("user", 10)

    await invalidateSession();
    await visit('/sign-in');

    await fillIn(`[data-test-reg-form-input="email"]`, "user0@email.com");
    await fillIn(`[data-test-reg-form-input="password"]`, "some-120");

    await click(`[data-test-reg-form-button="submit"]`)

    assert.equal(currentURL(), "/user", "user session is correctly created")
  });

  test('it shows errors on failed sign_in attempt', async function (assert) {
    this.server.createList("user", 10)

    await invalidateSession();
    await visit('/sign-in');

    await fillIn(`[data-test-reg-form-input="email"]`, "bad@email.com");
    await fillIn(`[data-test-reg-form-input="password"]`, "bad_password");

    await click(`[data-test-reg-form-button="submit"]`)

    assert.dom("[data-test-input='error-span']").exists();
  });
});
