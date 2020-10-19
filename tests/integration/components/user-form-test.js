import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import EditUserValidations from "gtd-to-do-client/validations/edit-user";
import lookupValidator from "ember-changeset-validations";

module("Integration | Component | user-form", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");

    const user = store.createRecord("user", {});

    const changeset = new Changeset(user, lookupValidator(EditUserValidations));

    this.set("changeset", changeset);
    this.set("user", user);
  });

  test("it renders all data", async function (assert) {
    await render(hbs`<UserForm @changeset={{this.changeset}} />`);

    assert.dom("[data-test-user-form-input-email]").exists();
    assert.dom("[data-test-user-form-input-password]").exists();
    assert.dom("[data-test-user-form-input-repeatPassword]").exists();
    assert.dom("[data-test-user-form-input-avatarUrl]").exists();
    assert.dom("[data-test-user-form-submit]").exists().hasText("Edytuj");
  });

  test("it can't save form if changeset has errors", async function (assert) {
    this.set("changeset.email", "null");

    await render(hbs`<UserForm @changeset={{this.changeset}} />`);
    await click("[data-test-user-form-submit]");

    assert
      .dom("[data-test-input='error-span']")
      .exists({ count: 1 })
      .hasText("Email must be a valid email address");
  });
});
