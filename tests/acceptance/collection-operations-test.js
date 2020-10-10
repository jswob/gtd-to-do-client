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
    const user = this.server.create("user", userData);
    this.set("user", user);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it should properly create collection", async function (assert) {
    await this.server.create("bucket", { owner: this.get("user") });
    await visit("/");
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

  test("it destroys collection model properly", async function (assert) {
    const bucket = this.server.create("bucket", { owner: this.get("user") });
    const bucketCollection = this.server.create("collection", {
      owner: this.get("user"),
      bucket: bucket,
    });
    const freeCollection = this.server.create("collection", {
      owner: this.get("user"),
    });
    await visit("/");

    await visit(
      `/user/${this.get("user.id")}/collections/collection/${
        bucketCollection.id
      }/delete`
    );

    await click("[data-test-form-button]");

    assert.equal(currentURL(), `/user/${this.get("user.id")}/collections`);

    assert.dom("[data-test-bucket-container='collection']").doesNotExist();
    assert.dom("[data-test-containers-box='collection']").exists({ count: 2 });

    await visit(
      `/user/${this.get("user.id")}/collections/collection/${
        freeCollection.id
      }/delete`
    );

    await click("[data-test-form-button]");

    assert.equal(currentURL(), `/user/${this.get("user.id")}/collections`);

    assert.dom("[data-test-bucket-container='collection']").doesNotExist();
    assert.dom("[data-test-containers-box='collection']").doesNotExist();
  });
});
