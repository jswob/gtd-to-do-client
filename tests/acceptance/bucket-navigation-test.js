import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { invalidateSession } from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | bucket navigation", function (hooks) {
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

  test("it properly navigates to bucket edit page from side-nav", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-side-menu='icon']");
    await click(
      "[data-test-side-menu-containers-box] [data-test-bucket-container='menu-button']"
    );
    await click("[data-test-bucket-container='link-edit']");

    assert.equal(
      currentURL(),
      `/user/${this.get("user.id")}/bucket/${this.get("bucket").id}/edit`
    );

    await click("[data-test-arrow-back]");

    assert.equal(currentURL(), this.get("collectionsLink"));
  });

  test("it properly navigates to bucket create page from side-nav", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-side-menu='icon']");
    await click("[data-test-side-menu-link-bucket]");
    assert.equal(currentURL(), `/user/${this.get("user.id")}/buckets/new`);
    await click("[data-test-arrow-back]");
    assert.equal(currentURL(), this.get("collectionsLink"));
  });

  test("it properly navigates to bucket delete page from side-nav", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-side-menu='icon']");
    await click(
      "[data-test-side-menu-containers-box] [data-test-bucket-container='menu-button']"
    );
    await click("[data-test-bucket-container='link-delete']");

    assert.equal(
      currentURL(),
      `/user/${this.get("user.id")}/bucket/${this.get("bucket").id}/delete`
    );

    await click("[data-test-arrow-back]");

    assert.equal(currentURL(), this.get("collectionsLink"));
  });

  test("it properly navigates to bucket create page from collections", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click("[data-test-nav-menu-icon]");
    await click("[data-test-nav-menu-new-bucket]");

    assert.equal(currentURL(), `/user/${this.get("user.id")}/buckets/new`);
    await click("[data-test-arrow-back]");
    assert.equal(currentURL(), this.get("collectionsLink"));
  });

  test("it properly navigates to bucket edit page from collections", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click(
      "[data-test-main-page-containers-box] [data-test-bucket-container='menu-button']"
    );
    await click("[data-test-bucket-container='link-edit']");

    assert.equal(
      currentURL(),
      `/user/${this.get("user.id")}/bucket/${this.get("bucket").id}/edit`
    );
    await click("[data-test-arrow-back]");
    assert.equal(currentURL(), this.get("collectionsLink"));
  });

  test("it properly navigates to bucket delete page from collections", async function (assert) {
    assert.equal(currentURL(), this.get("collectionsLink"));

    await click(
      "[data-test-main-page-containers-box] [data-test-bucket-container='menu-button']"
    );
    await click("[data-test-bucket-container='link-delete']");

    assert.equal(
      currentURL(),
      `/user/${this.get("user.id")}/bucket/${this.get("bucket").id}/delete`
    );
    await click("[data-test-arrow-back]");
    assert.equal(currentURL(), this.get("collectionsLink"));
  });
});
