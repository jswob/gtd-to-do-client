import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | pop-up-menu", function (hooks) {
  setupRenderingTest(hooks);

  test("it should open menu on icon click and close on background click", async function (assert) {
    await render(hbs`<PopUpMenu />`);

    assert.dom("[data-test-pop-up-menu='icon']").exists();
    assert.dom("[data-test-pop-up-menu='background']").doesNotExist();
    assert.dom("[data-test-pop-up-menu='menu']").doesNotExist;

    await click("[data-test-pop-up-menu='icon']");

    assert.dom("[data-test-pop-up-menu='icon']").exists();
    assert.dom("[data-test-pop-up-menu='background']").exists();
    assert.dom("[data-test-pop-up-menu='menu']").exists();

    await click("[data-test-pop-up-menu='background']");

    assert.dom("[data-test-pop-up-menu='icon']").exists();
    assert.dom("[data-test-pop-up-menu='background']").doesNotExist();
    assert.dom("[data-test-pop-up-menu='menu']").doesNotExist;
  });
});
