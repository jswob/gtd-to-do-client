import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import {
  currentSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | list operations", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    let userData = {
      id: 1342184893,
      email: "some@some.some",
      password: "some123",
    };
    const user = this.server.create("user", userData);
    const collection = this.server.create("collection", { owner: user });
    const collectionRouteLink = `/user/${user.id}/collections/collection/${collection.id}`;
    this.set("user", user);
    this.set("collection", collection);
    this.set("collectionRouteLink", collectionRouteLink);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it should properly create list", async function (assert) {
    const listTitle = "some title";

    await visit(this.get("collectionRouteLink") + "/lists/new");

    await fillIn("[data-test-list-form-input]", listTitle);
    await click("[data-test-list-form-submit]");

    assert.equal(currentURL(), this.get("collectionRouteLink"));

    assert
      .dom("[data-test-single-list-element]")
      .exists({ count: 1 })
      .includesText(listTitle);
  });

  test("it should properly update list", async function (assert) {
    const updatedListTitle = "updated list title";
    const list = this.server.create("list", {
      owner: this.get("user"),
      collection: this.collection,
    });

    await visit(this.get("collectionRouteLink") + `/list/${list.id}/edit`);

    await fillIn("[data-test-list-form-input]", updatedListTitle);
    await click("[data-test-list-form-submit]");

    assert.equal(currentURL(), this.get("collectionRouteLink"));

    assert
      .dom("[data-test-single-list-element]")
      .exists({ count: 1 })
      .includesText(updatedListTitle);
  });
});
