import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | checkbox", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });
    const list = this.server.create("list", { owner, collection });
    const task = this.server.create("task", { owner, list });

    const store = this.owner.lookup("service:store");

    const taskRecord = await store.findRecord("task", task.id);

    this.set("task", taskRecord);
  });

  test("it properly sets 'isDone'", async function (assert) {
    await render(hbs`<Checkbox @element={{this.task}} @property="isDone" />`);

    assert.dom("[data-test-checkbox]").exists();

    await click("[data-test-checkbox]");

    assert.dom("[data-test-checkbox]").exists().hasText("done");

    const task = this.server.schema.tasks.find(this.task.id);
    assert.ok(task.attrs.is_done, "Task record in api was updated");
  });
});
