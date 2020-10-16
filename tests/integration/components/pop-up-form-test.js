import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import TaskValidations from "gtd-to-do-client/validations/task";
import lookupValidator from "ember-changeset-validations";

module("Integration | Component | pop-up-form", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    this.set("toggleText", "some1");
    this.set("buttonLabel", "some2");
  });

  test("it properly renders and managa menu", async function (assert) {
    this.set("action", function () {});
    await render(hbs`
      <PopUpForm @toggleText={{this.toggleText}} @buttonLabel={{this.buttonLabel}} @action={{this.action}}>
        <p data-test-p >hello</p>
      </PopUpForm>`);

    assert
      .dom("[data-test-pop-up-form-toggle]")
      .exists()
      .hasText(this.toggleText);

    await click("[data-test-pop-up-form-toggle]");

    assert.dom("[data-test-pop-up-form-wrapper]").exists();
    assert.dom("[data-test-p]").exists();
    assert.dom("[data-test-pop-up-form-bg]").exists();
    assert
      .dom("[data-test-pop-up-form-button]")
      .exists()
      .hasText(this.buttonLabel);

    await click("[data-test-pop-up-form-bg]");

    assert.dom("[data-test-pop-up-form-wrapper]").doesNotExist();
  });

  test("it properly fires callback action", async function (assert) {
    assert.expect(3);

    this.set("action", function (value) {
      assert.ok(value, "It correctly fires action with passed argument");
      return true;
    });
    this.set("value", true);

    await render(hbs`
      <PopUpForm @toggleText={{this.toggleText}} @buttonLabel={{this.buttonLabel}} @action={{fn this.action this.value}}>
        <p data-test-p >hello</p>
      </PopUpForm>`);

    await click("[data-test-pop-up-form-toggle]");
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-pop-up-form-wrapper]").doesNotExist();

    this.set("action", function () {
      return false;
    });

    await click("[data-test-pop-up-form-toggle]");
    await click("[data-test-pop-up-form-button]");

    assert.dom("[data-test-pop-up-form-wrapper]").exists();
  });

  test("it properly rollbacks changeset", async function (assert) {
    const store = this.owner.lookup("service:store");
    const task = store.createRecord("task", {
      isDone: false,
    });
    this.set("property", "content");
    this.set(
      "changeset",
      new Changeset(task, lookupValidator(TaskValidations))
    );
    this.changeset.set(this.property, "new value");
    this.changeset.set("isDone", true);
    this.set("action", function () {});

    assert.equal(
      this.changeset.get("changes").length,
      2,
      "It starts with two changes"
    );

    await render(hbs`
    <PopUpForm @toggleText={{this.toggleText}} @buttonLabel={{this.buttonLabel}} @action={{this.action}} @changeset={{this.changeset}} @changesetRollbackProperty={{this.property}} />`);

    await click("[data-test-pop-up-form-toggle]");
    await click("[data-test-pop-up-form-bg]");

    assert.equal(
      this.changeset.get("changes").length,
      1,
      "It rollbacks only selected property"
    );

    this.changeset.set(this.property, "new value");

    assert.equal(
      this.changeset.get("changes").length,
      2,
      "It has two changes again"
    );

    await render(hbs`
    <PopUpForm @toggleText={{this.toggleText}} @buttonLabel={{this.buttonLabel}} @action={{this.action}} @changeset={{this.changeset}} />`);

    await click("[data-test-pop-up-form-toggle]");
    await click("[data-test-pop-up-form-bg]");

    assert.equal(
      this.changeset.get("changes").length,
      0,
      "If rollback property wasn't set rollbacks all changes"
    );
  });
});
