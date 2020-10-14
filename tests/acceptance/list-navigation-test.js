import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { invalidateSession } from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | list navigation", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let userData = {
    id: 1342184893,
    email: "some@some.some",
    password: "some123",
  };

  hooks.beforeEach(async function () {
    const user = this.server.create("user", userData);
    const collection = this.server.create("collection", { owner: user });
    this.set("user", user);
    this.set("collection", collection);
    this.set(
      "collectionLink",
      `/user/${user.id}/collections/collection/${collection.id}`
    );

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it properly navigates to create list", async function (assert) {
    await visit(this.get("collectionLink"));
    await click("[data-test-create-first-list-link]");

    assert.equal(currentURL(), this.get("collectionLink") + "/lists/new");

    await fillIn("[data-test-list-form-input]", "some title");
    await click("[data-test-list-form-submit]");

    assert.equal(currentURL(), this.get("collectionLink"));

    await click("[data-test-pop-up-menu-icon]");
    await click("[data-test-pop-up-menu-new-list]");

    assert.equal(currentURL(), this.get("collectionLink") + "/lists/new");

    await click("[data-test-arrow-back]");

    assert.equal(currentURL(), this.get("collectionLink"));
  });

  test("it properly navigates to edit list", async function (assert) {
    const list = this.server.create("list", {
      collection: this.get("collection"),
      owner: this.get("user"),
    });

    await visit(this.get("collectionLink"));

    await click("[data-test-pop-up-menu-icon]");
    await click("[data-test-pop-up-menu-edit-list]");

    assert.equal(
      currentURL(),
      `${this.get("collectionLink")}/list/${list.id}/edit`
    );

    await click("[data-test-arrow-back]");

    assert.equal(currentURL(), this.get("collectionLink"));
  });

  test("it properly navigates to delete list", async function (assert) {
    const list = this.server.create("list", {
      collection: this.get("collection"),
      owner: this.get("user"),
    });

    await visit(this.get("collectionLink"));

    await click("[data-test-pop-up-menu-icon]");
    await click("[data-test-pop-up-menu-delete-list]");

    assert.equal(
      currentURL(),
      `${this.get("collectionLink")}/list/${list.id}/delete`
    );

    await click("[data-test-arrow-back]");

    assert.equal(currentURL(), this.get("collectionLink"));
  });
});
