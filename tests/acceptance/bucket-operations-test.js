import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import {
  currentSession,
  invalidateSession,
} from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | bucket operations", function (hooks) {
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

    this.server.createList("collection", 2, { owner: user });
    // this.server.createList("collection", 2, {
    //   owner: user,
    //   bucket: buckets[0],
    // });

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("it correctly creates new bucket", async function (assert) {
    const bucketParams = {
      title: "some-1",
    };

    await click("[data-test-nav-menu-icon]");
    await click("[data-test-nav-menu-new-bucket]");

    await fillIn("[data-test-create-bucket-input]", bucketParams.title);
    await click("[data-test-create-bucket-submit]");

    assert.equal(currentURL(), `/user/${userData.id}/collections`);

    // It exsitst in nav-menu and on main page
    assert.dom("[data-test-containers-box='bucket']").exists({ count: 4 });
  });

  test("it correctly creates new bucket with relationships", async function (assert) {
    const bucketParams = {
      title: "some-1",
    };
    assert.dom("[data-test-containers-box='collection']").exists({ count: 4 });

    await click("[data-test-nav-menu-icon]");
    await click("[data-test-nav-menu-new-bucket]");

    await fillIn("[data-test-create-bucket-input]", bucketParams.title);
    await click("[data-test-create-bucket-collection]");

    await click("[data-test-create-bucket-submit]");

    assert.equal(currentURL(), `/user/${userData.id}/collections`);

    assert
      .dom("[data-test-bucket-container='collection']")
      .exists({ count: 2 });
    assert.dom("[data-test-containers-box='collection']").exists({ count: 2 });
  });

  test("it destroys bucket model", async function (assert) {
    await click("[data-test-bucket-container='menu-button']");
    await click("[data-test-bucket-container='link-delete']");

    await click("[data-test-delete-model-form-button]");

    assert.equal(currentURL(), `/user/${userData.id}/collections`);

    assert.dom("[data-test-bucket-container='collection']").doesNotExist();
    assert.dom("[data-test-containers-box='collection']").exists({ count: 4 });
  });
});
