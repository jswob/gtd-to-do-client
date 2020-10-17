import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | profile-main", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders each element", async function (assert) {
    const store = this.owner.lookup("service:store");
    this.set("user", store.createRecord("user", { email: "some123" }));

    await render(hbs`<ProfileMain @user={{this.user}} />`);

    assert.dom("[data-test-profile-main-wrapper]").exists();
    assert.dom("[data-test-profile-main-nav]").exists();
    assert.dom("[data-test-profile-main-details]").exists();
    assert.dom("[data-test-profile-main-links]").exists();
  });
});
