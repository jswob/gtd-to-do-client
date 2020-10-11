import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { invalidateSession } from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | collection navigation", function (hooks) {
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
    this.set("collectionsLink", `/user/${user.id}/collections`);
    const bucket = this.server.create("bucket", { owner: this.get("user") });
    this.set("bucket", bucket);
    const freeCollection = this.server.create("collection", { owner: user });
    const bucketCollection = this.server.create("collection", {
      owner: user,
      bucket: bucket,
    });
    this.set("freeCollection", freeCollection);
    this.set("bucketCollection", bucketCollection);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it properly navigates to collection and between them", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click(
      "[data-test-containers-box='bucket'] [data-test-collection-container='link']"
    );

    assert.equal(
      currentURL(),
      this.get("collectionsLink") +
        `/collection/${this.get("bucketCollection.id")}`
    );

    await click("[data-test-side-menu='icon']");
    await click(
      "[data-test-containers-box='collection'] [data-test-collection-container='link']"
    );

    assert.equal(
      currentURL(),
      this.get("collectionsLink") +
        `/collection/${this.get("freeCollection").id}`
    );
  });

  test("it properly navigates to create collection from side-nav", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-side-menu='icon']");
    await click("[data-test-side-menu-link-collection]");

    assert.equal(currentURL(), this.get("collectionsLink") + `/new`);

    await click("[data-test-arrow-back]");

    assert.equal(currentURL(), this.get("collectionsLink"));
  });

  test("it properly navigates to edit collection from side-nav", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-side-menu='icon']");
    await click(
      "[data-test-side-menu='aside'] [data-test-bucket-container='collection'] [data-test-collection-container='menu-button']"
    );
    await click("[data-test-collection-container='link-edit']");

    assert.equal(
      currentURL(),
      this.get("collectionsLink") +
        `/collection/${this.get("bucketCollection.id")}/edit`
    );

    await click("[data-test-arrow-back]");

    assert.equal(
      currentURL(),
      this.get("collectionsLink") +
        `/collection/${this.get("bucketCollection.id")}`
    );
  });

  test("it properly navigates to delete collection from side-nav", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-side-menu='icon']");
    await click(
      "[data-test-side-menu='aside'] [data-test-bucket-container='collection'] [data-test-collection-container='menu-button']"
    );
    await click("[data-test-collection-container='link-delete']");

    assert.equal(
      currentURL(),
      this.get("collectionsLink") +
        `/collection/${this.get("bucketCollection.id")}/delete`
    );

    await click("[data-test-arrow-back]");

    assert.equal(
      currentURL(),
      this.get("collectionsLink") +
        `/collection/${this.get("bucketCollection.id")}`
    );
  });
});
