import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | edit-user-main", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");

    this.set("user", store.createRecord("user", {}));
  });

  test("it renders all elements", async function (assert) {
    await render(hbs`<EditUserMain @user={{this.user}} />`);

    assert.dom("[data-test-edit-user-main]").exists();
    assert.dom("[data-test-edit-user-main-navigation]").exists();
    assert.dom("[data-test-edit-user-main-user-form]").exists();
  });
});
