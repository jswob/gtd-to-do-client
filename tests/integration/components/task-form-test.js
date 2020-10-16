import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import TaskValidations from "gtd-to-do-client/validations/task";
import lookupValidator from "ember-changeset-validations";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | task-form", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });
    const list = this.server.create("list", { owner, collection });

    const store = this.owner.lookup("service:store");

    const listRecord = await store.createRecord("list", { id: list.id });
    const userRecord = await store.createRecord("user", { id: owner.id });

    this.set(
      "task",
      store.createRecord("task", {
        isDone: false,
        list: listRecord,
        owner: userRecord,
      })
    );
    this.set(
      "changeset",
      new Changeset(this.task, lookupValidator(TaskValidations))
    );
  });

  test("it properly renders all elements and managa edit mode", async function (assert) {
    await render(hbs`<TaskForm @changeset={{this.changeset}} />`);

    assert
      .dom("[data-test-pop-up-form-toggle]")
      .exists()
      .hasText("Utwórz nowe zadanie")
      .hasClass("task-form-create-button");

    await click("[data-test-pop-up-form-toggle]");

    assert
      .dom("[data-test-pop-up-form-wrapper]")
      .exists()
      .hasClass("task-form-create");
    assert.dom("[data-test-task-form-title]").exists().hasText("Nowe zadanie");
    assert
      .dom("[data-test-task-form-input]")
      .exists()
      .hasProperty("placeholder", "np. Kupić chleb");
    assert.dom("[data-test-pop-up-form-button]").exists().hasText("Utwórz");

    await click("[data-test-pop-up-form-bg]");

    assert.dom("[data-test-pop-up-form-wrapper]").doesNotExist();

    // Edit mode
    await render(
      hbs`<TaskForm @editMode="true" @changeset={{this.changeset}} />`
    );

    assert
      .dom("[data-test-pop-up-form-toggle]")
      .exists()
      .hasText("Edytuj")
      .hasClass("task-form-edit-button");

    await click("[data-test-pop-up-form-toggle]");

    assert
      .dom("[data-test-pop-up-form-wrapper]")
      .exists()
      .hasClass("task-form-edit");
    assert.dom("[data-test-task-form-title]").exists().hasText("Edytuj");
    assert.dom("[data-test-task-form-input]").exists();
    assert.dom("[data-test-pop-up-form-button]").exists().hasText("Edytuj");

    await click("[data-test-pop-up-form-bg]");

    assert.dom("[data-test-pop-up-form-wrapper]").doesNotExist();
  });

  test("it properly updates changeset and fires passed clearAction", async function (assert) {
    assert.expect(2);

    this.set("clearAction", function () {
      assert.ok(true, "It fired clearAction");
    });
    this.set("content", "some text");

    await render(
      hbs`<TaskForm @changeset={{this.changeset}} @clearAction={{this.clearAction}} />`
    );

    await click("[data-test-pop-up-form-toggle]");
    await fillIn("[data-test-task-form-input]", this.content);
    await click("[data-test-pop-up-form-button]");

    assert.equal(this.task.get("content"), this.content, "It saved changeset");
  });

  test("it won't save changeset if it has errors", async function (assert) {
    this.set("content", "");

    await render(hbs`<TaskForm @changeset={{this.changeset}} />`);

    await click("[data-test-pop-up-form-toggle]");
    await fillIn("[data-test-task-form-input]", this.content);
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-pop-up-form-wrapper]").exists();
    assert
      .dom("[data-test-input='error-span']")
      .exists()
      .hasText("Content can't be blank");
  });
});
