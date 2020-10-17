import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | profile-main/operation-links", function (
  hooks
) {
  setupRenderingTest(hooks);

  test("it renders all elements", async function (assert) {
    await render(hbs`<ProfileMain::OperationLinks />`);

    assert.dom("[data-test-profile-main-operation-links-wrapper]").exists();
    assert
      .dom("[data-test-profile-main-operation-links-edit]")
      .exists()
      .hasText("Edytuj");
    assert
      .dom("[data-test-profile-main-operation-links-delete]")
      .exists()
      .hasText("Usuń");
  });
});
