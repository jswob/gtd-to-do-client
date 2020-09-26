import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | side-menu/user-menu-part", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders all data", async function (assert) {
    await render(hbs`<SideMenu::UserMenuPart />`);

    assert.dom("[data-test-user-menu-part='photo-link']").exists();
    assert.dom("[data-test-user-menu-part='username']").exists();
    assert.dom("[data-test-user-menu-part='logout']").exists();
  });
});
