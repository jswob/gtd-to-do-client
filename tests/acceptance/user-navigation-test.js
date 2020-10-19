import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { invalidateSession } from "ember-simple-auth/test-support";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | user navigation", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  let userData = {
    id: 1342184893,
    email: "some@some.some",
    password: "some123",
  };

  hooks.beforeEach(async function () {
    const user = this.server.create("user", userData);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it properly navigates to user profile page from side-nav", async function (assert) {
    await click("[data-test-top-menu='side-menu']");

    await click("[data-test-user-menu-part='photo-link']");

    assert.equal(currentURL(), `/user/${userData.id}/profile`);
  });

  test("it properly navigates to user edit page", async function (assert) {
    await click("[data-test-top-menu='side-menu']");

    await click("[data-test-user-menu-part='photo-link']");

    await click("[data-test-profile-main-operation-links-edit]");

    assert.equal(currentURL(), `/user/${userData.id}/edit`);
  });

  test("it properly navigates to user delete page", async function (assert) {
    await click("[data-test-top-menu='side-menu']");

    await click("[data-test-user-menu-part='photo-link']");

    await click("[data-test-profile-main-operation-links-delete]");

    assert.equal(currentURL(), `/user/${userData.id}/delete`);
  });
});
