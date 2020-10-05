import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import Changeset from "ember-changeset";
import { validateLength } from "ember-changeset-validations/validators";
import lookupValidator from "ember-changeset-validations";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | x-form/input", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Create custom validation
    const TestingValidations = {
      email: validateLength({ min: 6 }),
    };

    const user = this.owner.lookup("service:store").createRecord("user", {});

    // Create custom changeset
    const changeset = new Changeset(user, lookupValidator(TestingValidations));

    this.set("changeset", changeset);
    this.set("property", "email");
  });

  test("it renders all elements", async function (assert) {
    await render(
      hbs`<XForm::Input @label={{this.property}} @changeset={{this.changeset}} @property={{this.property}} />`
    );

    assert.dom("[data-test-input='div']").exists();
    assert
      .dom("[data-test-input='input']")
      .exists()
      .hasProperty("placeholder", this.property);
  });

  test("it shows error-span only if error message is sent", async function (assert) {
    await render(
      hbs`<XForm::Input @label={{this.property}} @changeset={{this.changeset}} @property={{this.property}} />`
    );

    assert.dom("[data-test-input='error-span']").doesNotExist();

    await fillIn("[data-test-input='input']", "smth");

    assert
      .dom("[data-test-input='error-span']")
      .exists()
      .hasText("Email is too short (minimum is 6 characters)");
  });

  test("it correctly manage classes on error", async function (assert) {
    const color = "green-700";
    const errorColor = "red-700";
    this.set("color", color);
    this.set("errorColor", errorColor);

    await render(
      hbs`
        <XForm::Input @label={{this.property}} @changeset={{this.changeset}}
          @errorColor={{this.errorColor}} @property={{this.property}} @color={{this.color}} />`
    );

    assert
      .dom("[data-test-input='input']")
      .hasClass(`text-${color}`, `placeholder-${color}`, `border-${color}`);

    await fillIn("[data-test-input='input']", "smth");

    assert
      .dom("[data-test-input='input']")
      .hasClass(
        `text-${errorColor}`,
        `placeholder-${errorColor}`,
        `border-${errorColor}`
      );

    assert
      .dom("[data-test-input='input']")
      .doesNotHaveClass(
        `text-${color}`,
        `placeholder-${color}`,
        `border-${color}`
      );
  });

  test("it updates value", async function (assert) {
    await render(
      hbs`<XForm::Input @label="Email" @changeset={{this.changeset}} @property={{this.property}} />`
    );

    assert.dom("[data-test-input='input']").hasValue("");

    await fillIn("[data-test-input='input']", "some-test-value");

    assert.dom("[data-test-input='input']").hasValue("some-test-value");
    assert.equal("some-test-value", this.changeset.email);
  });

  test("it sets equal 'id' for input and 'for' for label", async function (assert) {
    await render(
      hbs`<XForm::Input @label="Email" @changeset={{this.changeset}} @property={{this.property}} />`
    );

    // get id from input element
    let id = this.element.querySelector("[data-test-input='input']").id;

    assert.ok(id);
    assert.dom("[data-test-input='input']").hasAttribute("id", id);
  });
});
