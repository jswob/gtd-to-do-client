import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import {
  currentSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | user operations", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let userData = {
    id: 1342184893,
    email: "some@some.some",
    password: "some123",
  };

  hooks.beforeEach(async function () {
    this.server.create("user", userData);

    this.set("userLink", `/user/${userData.id}`);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it correctly logout user", async function (assert) {
    await click("[data-test-top-menu='side-menu']");
    await click("[data-test-logout-icon]");

    assert.equal(currentURL(), "/sign-in");
  });

  test("it correctly logout user", async function (assert) {
    await click("[data-test-top-menu='side-menu']");
    await click("[data-test-logout-icon]");

    assert.equal(currentURL(), "/sign-in");
  });

  test("it correctly updates user", async function (assert) {
    const newEmail = "some@fancy.email";

    await visit(this.userLink + "/edit");

    await fillIn("[data-test-user-form-input-email]", newEmail);
    await click("[data-test-user-form-submit]");

    assert.equal(currentURL(), this.userLink + "/profile");

    const user = this.server.schema.users.find(userData.id);
    assert.equal(user.email, newEmail, "Email has been updated");
  });

  test("it correctly deletes user", async function (assert) {
    await visit(this.userLink + "/delete");

    await click("[data-test-delete-model-form-button]");

    assert.equal(currentURL(), "/sign-in");
  });
});
