import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | tasks-menu", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const store = this.owner.lookup("service:store");
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });
    const list = this.server.create("list", { owner, collection });

    console.log(list.id);
    const listRecord = await store.findRecord("list", list.id);

    this.set("user", owner);
    this.set("collection", collection);
    this.set("currentList", listRecord);

    const task1 = this.server.create("task", { owner, list });
    const task2 = this.server.create("task", { owner, list });

    this.set(
      "tasks",
      A([
        await store.findRecord("task", task1.id),
        await store.findRecord("task", task2.id),
      ])
    );
    this.set("activeTasks", A([]));
  });

  test("it renders all data and manage activeTasks", async function (assert) {
    await render(
      hbs`<TasksMenu @list={{this.currentList}} @activeTasks={{this.activeTasks}} />`
    );

    assert.equal(this.activeTasks.length, 0, "None task is active");

    assert.dom("[data-test='task-control-panel-create']").exists();
    assert.dom("[data-test-task-element-wrapper]").exists({ count: 2 });

    await click("[data-test-task-menu-task='1']");

    assert.equal(this.activeTasks.length, 1, "One task is active");

    assert.dom("[data-test='task-control-panel-edit']").exists();
    assert.dom("[data-test='task-control-panel-delete']").exists();

    await click("[data-test-task-menu-task='2']");

    assert.equal(this.activeTasks.length, 2, "Both tasks are active");

    assert.dom("[data-test='task-control-panel-delete']").exists();

    const store = this.owner.lookup("service:store");

    const list = this.server.create("list", {
      owner: this.user,
      collection: this.collection,
    });

    this.set("currentList", await store.findRecord("list", list.id));

    assert.dom("[data-test-task-element-wrapper]").exists({ count: 0 });

    await render(hbs``);
  });
});
