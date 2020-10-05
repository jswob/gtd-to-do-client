import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | x-form/button", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders button element", async function (assert) {
    this.set("action", function () {
      return 0;
    });

    await render(hbs`<XForm::Button @action={{this.action}} />`);

    assert.dom("[data-test-form-button]").exists();
  });

  test("it renders text inside button", async function (assert) {
    const text = "some-text";
    this.set("text", text);

    this.set("action", function () {
      return 0;
    });

    await render(
      hbs`<XForm::Button @action={{this.action}}>{{this.text}}</XForm::Button>`
    );

    assert.dom("[data-test-form-button]").hasText(text);
  });

  test("it fires sended action after click", async function (assert) {
    this.set("value", "123");
    this.set("action", () => {
      this.set("value", "321");
    });

    await render(hbs`<XForm::Button @action={{this.action}} />`);

    assert.equal(this.value, "123", "after render value is '123'");
    await click("[data-test-form-button]");
    assert.equal(this.value, "321", "after clicking on button value is '321'");
  });
});
