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
    const newListRouteLink = `/user/${user.id}/collections/collection/${collection.id}/lists/new`;
    this.set("user", user);
    this.set("collection", collection);
    this.set("collectionRouteLink", collectionRouteLink);
    this.set("newListRouteLink", newListRouteLink);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it should properly create collection", async function (assert) {
    const listTitle = "some title";

    await visit(this.get("newListRouteLink"));

    await fillIn("[data-test-list-form-input]", listTitle);
    await click("[data-test-list-form-submit]");

    assert.equal(currentURL(), this.get("collectionRouteLink"));

    assert
      .dom("[data-test-single-list-element]")
      .exists({ count: 1 })
      .includesText(listTitle);
  });
});
