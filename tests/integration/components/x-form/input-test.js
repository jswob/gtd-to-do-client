import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | x-form/input", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders all elements", async function(assert) {
    await render(hbs`<XForm::Input @errorMessage="some-error-message" />`);

    assert.dom("[data-test-input='div']").exists();
    assert.dom("[data-test-input='label']").exists();
    assert.dom("[data-test-input='input']").exists();
    assert.dom("[data-test-input='error-span']").exists();
  });

  test("it shows error-span only if error message is sent", async function(assert) {
    this.set("errorMessage", "some-error-message");

    await render(hbs`<XForm::Input @errorMessage={{this.errorMessage}} />`);

    assert
      .dom("[data-test-input='error-span']")
      .exists()
      .hasText("some-error-message");

    this.set("errorMessage", "");

    assert.dom("[data-test-input='error-span']").doesNotExist();
  });

  test("it updates value", async function(assert) {
    this.set("value", "");

    await render(hbs`<XForm::Input @value={{this.value}} />`);

    assert.dom("[data-test-input='input']").hasValue("");

    await fillIn("[data-test-input='input']", "some-test-value");

    assert.dom("[data-test-input='input']").hasValue("some-test-value");
    assert.equal(this.value, "some-test-value");
  });

  test("it sets equal 'id' for input and 'for' for label", async function(assert) {
    await render(hbs`<XForm::Input @inputID />`);

    // get id from input element
    let id = this.element.querySelector("[data-test-input='input']").id;

    assert.ok(id);
    assert.dom("[data-test-input='input']").hasAttribute("id", id);
    assert.dom("[data-test-input='label']").hasAttribute("for", id);
  });
});
