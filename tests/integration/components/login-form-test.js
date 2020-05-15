import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import LoginValidations from "gtd-to-do-client/validations/login";
import lookupValidator from "ember-changeset-validations";

module("Integration | Component | login-form", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const user = this.owner.lookup("service:store").createRecord("user", {});

    const changeset = new Changeset(user, lookupValidator(LoginValidations));

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
    assert.dom(`[data-test-reg-form-button="submit"]`).exists();
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
});
