import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import {
  currentSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | transition protection", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  const userData = {
    id: 1342184893,
    email: "some@some.some",
    password: "some123",
  };

  hooks.beforeEach(async function () {
    this.server.createList("user", 10);
    this.server.create("user", userData);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it cant visit sign-in route if session is authenticated", async function (assert) {
    await visit("/sign-in");
    assert.equal(currentURL(), `/user/${userData.id}/collections`);
  });

  test("it can visit sign-in route if session is unauthenticated", async function (assert) {
    await invalidateSession();

    await visit("/sign-in");
    assert.equal(currentURL(), "/sign-in");
  });

  test("it cant visit sign-up route if session is authenticated", async function (assert) {
    await visit("/sign-up");
    assert.equal(currentURL(), `/user/${userData.id}/collections`);
  });

  test("it can visit sign-up route if session is unauthenticated", async function (assert) {
    await invalidateSession();

    await visit("/sign-up");
    assert.equal(currentURL(), "/sign-up");
  });

  test("it can visit user route if session is authenticated", async function (assert) {
    assert.equal(currentURL(), `/user/${userData.id}/collections`);
  });

  test("it cant visit user route if session is authenticated", async function (assert) {
    await invalidateSession();

    await visit(`/user/${userData.id}`);
    assert.equal(currentURL(), "/sign-in");
  });

  test("it cant visit user route if user_id from token is diffrent from this from link", async function (assert) {
    await visit(`/user/987654321`);
    assert.equal(currentURL(), `/user/${userData.id}/collections`);
  });
});
