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
    this.server.create("user", { email: "some@some.some", password: "some123" })

    await invalidateSession();
    await visit('/sign-in');

    await fillIn(`[data-test-reg-form-input="email"]`, "some@some.some");
    await fillIn(`[data-test-reg-form-input="password"]`, "some123");

    await click(`[data-test-reg-form-button="submit"]`)

    assert.ok(currentSession().isAuthenticated, "session is authenticated")
    assert.equal(currentURL(), "/user", "user is redirected after sign in")
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

  test("it should redirect to user page after successful sign up", async function (assert) {
    assert.expect(2);

    this.server.createList("user", 10)

    await invalidateSession();
    await visit('/sign-up');
    await visit('/sign-up');

    const testUser = {
      email: "some@some.some",
      password: "some123"
    }

    await fillIn(`[data-test-reg-form-input="email"]`, testUser.email);
    await fillIn(`[data-test-reg-form-input="password"]`, testUser.password);
    await fillIn(`[data-test-reg-form-input="repeatPassword"]`, testUser.password);

    await click(`[data-test-reg-form-button="submit"]`)

    this.server.schema.users.all().models.forEach(user => {
      if (user.email === testUser.email) {
        assert.ok(true, "user was successfully created")
      }
    })

    assert.equal(currentURL(), "/sign-in", "user was successfully redirected");
  })

  test("if email is already taken it should show error message", async function (assert) {
    await invalidateSession();
    await visit('/sign-up');
    await visit('/sign-up');

    const testUser = {
      email: "some@some.some",
      password: "some123"
    }

    this.server.create("user", { email: testUser.email, password: testUser.password })

    await fillIn(`[data-test-reg-form-input="email"]`, testUser.email);
    await fillIn(`[data-test-reg-form-input="password"]`, testUser.password);
    await fillIn(`[data-test-reg-form-input="repeatPassword"]`, testUser.password);

    await click(`[data-test-reg-form-button="submit"]`)

    assert.dom("[data-test-input='error-span']").exists().hasText("email has already been taken")
  })
});
