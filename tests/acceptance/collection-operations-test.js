import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import {
  currentSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | collection operations", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let userData = {
    id: 1342184893,
    email: "some@some.some",
    password: "some123",
  };

  hooks.beforeEach(async function () {
    let user = this.server.create("user", userData);
    this.server.create("bucket", { owner: user });

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it should properly create collection", async function (assert) {
    const collectionTitle = "some title";

    await click("[data-test-nav-menu-icon]");
    await click("[data-test-nav-menu-new-collection]");

    await fillIn("[data-test-collection-form-input]", collectionTitle);
    await click("[data-test-form-button]");

    assert
      .dom("[data-test-containers-box='collection']")
      .exists({ count: 1 })
      .includesText(collectionTitle);

    const bucketCollectionTitle = "other title";

    await click("[data-test-side-menu-link-collection]");

    await fillIn("[data-test-collection-form-input]", bucketCollectionTitle);
    await click("[data-test-checkbox-button]");
    await click("[data-test-form-button]");

    assert
      .dom("[data-test-bucket-container='collection']")
      .exists({ count: 1 })
      .includesText(bucketCollectionTitle);
    assert
      .dom("[data-test-containers-box='collection']")
      .exists({ count: 1 })
      .includesText(collectionTitle);
  });
});
