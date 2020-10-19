import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | delete-user-main", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");

    this.set("user", store.createRecord("user", {}));
  });

  test("it renders all data", async function (assert) {
    await render(hbs`<DeleteUserMain @user={{this.user}} />`);

    assert.dom("[data-test-delete-user-main]").exists();
    assert.dom("[data-test-delete-user-main-navigation]").exists();
    assert.dom("[data-test-delete-user-main-delete-model-form]").exists();
  });
});
