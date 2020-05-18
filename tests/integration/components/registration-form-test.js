import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import RegistrationValidations from "gtd-to-do-client/validations/registration";
import lookupValidator from "ember-changeset-validations";

module("Integration | Component | registration-form", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const user = this.owner.lookup("service:store").createRecord("user", {});

    const changeset = new Changeset(
      user,
      lookupValidator(RegistrationValidations)
    );

    this.set("changeset", changeset);
  });

  test("it renders all data", async function (assert) {
    await render(
      hbs`
      <RegistrationForm 
        @changeset={{this.changeset}} 
      />`
    );

    assert.dom(`[data-test-form]`).exists();
    assert.dom(`[data-test-reg-form-input="email"]`).exists();
    assert.dom(`[data-test-reg-form-input="password"]`).exists();
    assert.dom(`[data-test-reg-form-input="repeatPassword"]`).exists();
    assert.dom(`[data-test-reg-form-button="submit"]`).exists();
    assert.dom(`[data-test-reg-form-button="clear"]`).exists();
    assert.dom(`[data-test-form="redirection"]`).exists();
  });

  test("it can't save model if changeset has errors", async function (assert) {
    await render(hbs`<RegistrationForm @changeset={{this.changeset}} />`);
    await fillIn(`[data-test-reg-form-input="email"]`, "Bad data");

    const formText = document
      .querySelector(`[data-test-form]`)
      .textContent.trim();

    assert.ok(formText.includes("Email must be a valid email address"));
  });

  test("after clicking on cancel button all changese are rollback", async function (assert) {
    await render(hbs`<RegistrationForm @changeset={{this.changeset}} />`);

    await fillIn(`[data-test-reg-form-input="email"]`, "some@some.some");
    await fillIn(`[data-test-reg-form-input="password"]`, "Some123");
    await fillIn(`[data-test-reg-form-input="repeatPassword"]`, "Some123");

    await click(`[data-test-reg-form-button="clear"]`);

    assert.dom(`[data-test-reg-form-input="email"]`).hasValue("");
    assert.dom(`[data-test-reg-form-input="password"]`).hasValue("");
    assert.dom(`[data-test-reg-form-input="repeatPassword"]`).hasValue("");
  });
});
