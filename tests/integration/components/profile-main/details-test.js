import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | profile-main/details", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders all data", async function (assert) {
    const store = this.owner.lookup("service:store");

    this.set("user", store.createRecord("user", { email: "some@some.some" }));

    await render(hbs`<ProfileMain::Details @user={{this.user}} />`);

    assert.dom("[data-test-profile-main-details-wrapper]").exists();
    assert
      .dom("[data-test-profile-main-details-img]")
      .exists()
      .hasProperty(
        "src",
        "http://localhost:7357/assets/images/profile-img.jpg"
      );
    assert
      .dom("[data-test-profile-main-details-email]")
      .exists()
      .hasText(this.user.email);

    this.user.set("avatarUrl", "/some/avatar");
    await render(hbs`<ProfileMain::Details @user={{this.user}} />`);

    assert
      .dom("[data-test-profile-main-details-img]")
      .exists()
      .hasProperty("src", "http://localhost:7357" + this.user.avatarUrl);
  });
});
