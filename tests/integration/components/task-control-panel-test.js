import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";

module("Integration | Component | task-control-panel", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");
    this.set("currentList", store.createRecord("list", {}));
    this.set("activeTasks", A([]));

    this.set("pushToActiveTasks", async function () {
      const newTask = store.createRecord("task", { isDone: false });

      await this.get("activeTasks").pushObject(newTask);
    });
  });

  test("it properly switches forms", async function (assert) {
    await render(
      hbs`<TaskControlPanel @currentList={{this.currentList}} @activeTasks={{this.activeTasks}} />`
    );

    assert.dom("[data-test='task-control-panel-create']").exists();
    assert.dom("[data-test='task-control-panel-edit']").doesNotExist();
    assert.dom("[data-test='task-control-panel-delete']").doesNotExist();

    await this.pushToActiveTasks();
    await render(
      hbs`<TaskControlPanel @currentList={{this.currentList}} @activeTasks={{this.activeTasks}} />`
    );

    assert.dom("[data-test='task-control-panel-create']").doesNotExist();
    assert.dom("[data-test='task-control-panel-edit']").exists();
    assert.dom("[data-test='task-control-panel-delete']").exists();

    await this.pushToActiveTasks();
    await this.pushToActiveTasks();
    await render(
      hbs`<TaskControlPanel @currentList={{this.currentList}} @activeTasks={{this.activeTasks}} />`
    );

    assert.dom("[data-test='task-control-panel-create']").doesNotExist();
    assert.dom("[data-test='task-control-panel-edit']").doesNotExist();
    assert.dom("[data-test='task-control-panel-delete']").exists();

    await render(hbs``);
  });
});
