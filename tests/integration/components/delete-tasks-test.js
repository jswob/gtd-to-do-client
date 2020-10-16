import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";

module("Integration | Component | delete-tasks", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders all necessary data", async function (assert) {
    await render(hbs`<DeleteTasks />`);

    assert.dom("[data-test-pop-up-form-toggle]").exists().hasText("Usuń");

    await click("[data-test-pop-up-form-toggle]");

    assert.dom("[data-test-pop-up-form-wrapper]").exists();
    assert.dom("[data-test-pop-up-form-wrapper] h3").exists().hasText("Usuń");
    assert
      .dom("[data-test-pop-up-form-wrapper] p")
      .exists()
      .hasText(
        'Wszystkie zaznaczone zadania zostaną trwale usunięte, jeżeli jesteś pewien, że chcesz kontynuować wciśnij przycisk "Usuń"'
      );
    assert
      .dom("[data-test-pop-up-form-wrapper] button")
      .exists()
      .hasText("Usuń");
  });

  test("it correctly delete tasks", async function (assert) {
    const store = this.owner.lookup("service:store");
    const tasks = A([
      store.createRecord("task", {}),
      store.createRecord("task", {}),
    ]);
    this.set("tasks", tasks);

    await render(hbs`<DeleteTasks @tasks={{this.tasks}} />`);

    await click("[data-test-pop-up-form-toggle]");
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-pop-up-form-wrapper]").doesNotExist();

    tasks.forEach((task) => {
      assert.ok(task.isDeleted, "Task is deleted");
    });
  });
});
