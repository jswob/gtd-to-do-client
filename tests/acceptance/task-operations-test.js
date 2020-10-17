import { module, test } from "qunit";
import { visit, currentURL, fillIn, click } from "@ember/test-helpers";
import { invalidateSession } from "ember-simple-auth/test-support";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | task operations", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    let userData = {
      id: 1342184893,
      email: "some@some.some",
      password: "some123",
    };

    const owner = this.server.create("user", userData);
    const collection = this.server.create("collection", { owner });
    const list = this.server.create("list", { owner, collection });

    const collectionRouteLink = `/user/${owner.id}/collections/collection/${collection.id}`;

    this.set("user", owner);
    this.set("collection", collection);
    this.set("list", list);
    this.set("collectionRouteLink", collectionRouteLink);

    await invalidateSession();
    await visit("/sign-in");

    await fillIn(`[data-test-reg-form-input="email"]`, userData.email);
    await fillIn(`[data-test-reg-form-input="password"]`, userData.password);

    await click(`[data-test-reg-form-button="submit"]`);
  });

  test("It can create task", async function (assert) {
    const content = "some content";
    await visit(this.collectionRouteLink);

    assert.dom("[data-test-task-element-content]").doesNotExist();

    await click("[data-test='task-control-panel-create']");
    await fillIn("[data-test-task-form-input]", content);
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-task-element-content]").exists({ count: 1 });

    await visit("/");
  });

  test("It can make task done", async function (assert) {
    this.server.create("task", { owner: this.user, list: this.list });
    await visit(this.collectionRouteLink);

    await click(
      "[data-test-task-menu-task='1'] [data-test-task-element-checkbox]"
    );

    assert
      .dom("[data-test-task-menu-task='1'] [data-test-task-element-checkbox]")
      .exists()
      .hasText("done");

    await visit("/");
  });

  test("It can edit task", async function (assert) {
    const updatedContent = "updated content";
    this.server.create("task", { owner: this.user, list: this.list });
    await visit(this.collectionRouteLink);

    await click("[data-test-task-menu-task='1']");

    await click("[data-test='task-control-panel-edit']");
    await fillIn("[data-test-task-form-input]", updatedContent);
    await click("[data-test-pop-up-form-button]");

    assert
      .dom("[data-test-task-menu-task='1']")
      .exists()
      .includesText(updatedContent);

    await visit("/");
  });

  test("It can delete single or multiple tasks", async function (assert) {
    this.server.createList("task", 3, { owner: this.user, list: this.list });
    await visit(this.collectionRouteLink);

    assert.dom("[data-test-task-element-content]").exists({ count: 3 });

    await click("[data-test-task-menu-task='1']");

    await click("[data-test='task-control-panel-delete']");
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-task-element-content]").exists({ count: 2 });

    await click("[data-test-main-page-wrapper]");

    await click("[data-test-task-menu-task='2']");
    await click("[data-test-task-menu-task='3']");

    await click("[data-test='task-control-panel-delete']");
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-task-element-content]").doesNotExist();

    await visit("/");
  });
});
