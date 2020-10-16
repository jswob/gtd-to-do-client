import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | task-element", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });
    const list = this.server.create("list", { owner, collection });
    const task1 = this.server.create("task", { owner, list });
    const task2 = this.server.create("task", { owner, list });

    const store = this.owner.lookup("service:store");
    this.set("activeTasks", A([]));
    this.set(
      "tasks",
      A([
        await store.findRecord("task", task1.id),
        await store.findRecord("task", task2.id),
      ])
    );
  });

  test("it properly renders all necessary data", async function (assert) {
    await render(hbs`
      <TaskElement @task={{this.tasks.firstObject}} @activeTasks={{this.activeTasks}} />
    `);

    assert.dom("[data-test-task-element-wrapper]").exists();
    assert
      .dom("[data-test-task-element-content]")
      .exists()
      .hasText(this.tasks.firstObject.content);
    assert.dom("[data-test-task-element-checkbox]").exists();
  });

  test("it properly manage isDone", async function (assert) {
    await render(hbs`
      <TaskElement @task={{this.tasks.firstObject}} @activeTasks={{this.activeTasks}} />
    `);

    await click("[data-test-task-element-checkbox]");

    assert
      .dom("[data-test-task-element-wrapper]")
      .exists()
      .hasClass("bg-green-400");
    assert.dom("[data-test-task-element-checkbox]").exists("bg-green-700");

    await click("[data-test-task-element-checkbox]");

    assert
      .dom("[data-test-task-element-wrapper]")
      .exists()
      .hasClass("bg-gray-200");
    assert.dom("[data-test-task-element-checkbox]").exists("bg-gray-400");
  });

  test("it properly manage activeTasks", async function (assert) {
    await render(hbs`
    {{#each this.tasks as |task|}}
      <TaskElement data-test={{task.id}} @task={{task}} @activeTasks={{this.activeTasks}} />
    {{/each}}
    `);

    assert.equal(this.activeTasks.length, 0, "None task is active");

    await click(`[data-test='${this.tasks.firstObject.id}']`);

    assert
      .dom(`[data-test='${this.tasks.firstObject.id}']`)
      .exists()
      .hasClass("bg-blue-300");
    assert.dom("[data-test-task-element-checkbox]").exists("bg-blue-700");

    assert.equal(this.activeTasks.length, 1, "One task is active");

    await click("[data-test-task-element-checkbox]");

    assert
      .dom(`[data-test='${this.tasks.firstObject.id}']`)
      .exists()
      .hasClass("bg-blue-300");
    assert.dom("[data-test-task-element-checkbox]").exists("bg-blue-700");
  });
});
