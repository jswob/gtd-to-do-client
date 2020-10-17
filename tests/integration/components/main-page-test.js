import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | main-page", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const store = this.owner.lookup("service:store");
    this.set("store", store);
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });

    const lists = A(this.server.createList("list", 2, { owner, collection }));
    this.server.createList("task", 2, { owner, list: lists[0] });
    this.server.createList("task", 3, { owner, list: lists[1] });

    const listsRecords = A([
      await store.findRecord("list", lists[0].id),
      await store.findRecord("list", lists[1].id),
    ]);

    this.set("model", {
      collection,
      lists: listsRecords,
    });
  });

  test("it properly renders all elements", async function (assert) {
    await render(hbs`<MainPage @model={{this.model}} />`);

    assert.dom("[data-test-list-element]").exists({ count: 2 });
    assert.dom("[data-test-top-menu='side-menu']").exists();
    assert.dom("[data-test-navigation-icon]").exists().hasText("more_vert");
    assert.dom("[data-test-task-element-content]").exists({ count: 2 });
    assert.dom("[data-test='task-control-panel-create']").exists();

    this.set("model", {
      collection: this.store.createRecord("collection", {}),
      lists: A([]),
    });

    assert.dom("[data-test-list-element]").doesNotExist();
    assert.dom("[data-test-task-element-content]").doesNotExist();
    assert.dom("[data-test='task-control-panel-create']").doesNotExist();
    assert.dom("[data-test-top-menu='side-menu']").exists();
    assert.dom("[data-test-arrow-back]").exists().hasText("arrow_back");
    assert.dom("[data-test-none-list-menu-text]").exists();
    assert.dom("[data-test-none-list-menu-link]").exists();
  });

  test("it resets all activeTasks", async function (assert) {
    await render(hbs`<MainPage @model={{this.model}} />`);

    assert.dom("[data-test='task-control-panel-create']").exists();

    await click("[data-test-task-menu-task='1']");

    assert.dom("[data-test='task-control-panel-edit']").exists();
    assert.dom("[data-test='task-control-panel-delete']").exists();

    await click("[data-test-task-menu-task='2']");

    assert.dom("[data-test='task-control-panel-delete']").exists();

    await click("[data-test-main-page-wrapper]");

    assert.dom("[data-test='task-control-panel-create']").exists();

    await render(hbs``);
  });

  // test("it switches lists", async function (assert) {
  //   await render(hbs`<MainPage @model={{this.model}} />`);

  //   assert.dom("[data-test-list-element]").exists({ count: 2 });

  //   await click("[data-test-list-element-id='2']");

  //   assert.dom("[data-test-list-element]").exists({ count: 3 });

  //   await render(hbs``);
  // });
});
