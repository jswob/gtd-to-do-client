import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | delete-model-form", function (hooks) {
  setupRenderingTest(hooks);

  // hooks.beforeEach(function () {});

  test("it renders all data", async function (assert) {
    const text = "some text";
    this.set("text", text);
    await render(hbs`<DeleteModelForm>{{this.text}}</DeleteModelForm>`);

    assert.dom("[data-test-delete-model-form='p']").exists().hasText(text);
  });

  test("it deletes model", async function (assert) {
    const model = this.owner.lookup("service:store").createRecord("user", {});
    this.set("model", model);

    await render(
      hbs`
        <DeleteModelForm @model={{this.model}}></DeleteModelForm>`
    );

    assert.notOk(model.isDeleted);

    await click("[data-test-delete-model-form-button]");

    assert.ok(model.isDeleted);
  });
});
