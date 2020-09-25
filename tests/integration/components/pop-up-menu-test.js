import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | pop-up-menu", function (hooks) {
  setupRenderingTest(hooks);

  test("it should open menu on icon click and close on background click", async function (assert) {
    const label = "some text";
    this.set("label", label);

    await render(hbs`<PopUpMenu @label={{this.label}} />`);

    assert.dom("[data-test-pop-up-menu='icon']").exists();
    assert.dom("[data-test-pop-up-menu='background']").doesNotExist();
    assert.dom("[data-test-pop-up-menu='menu']").doesNotExist;

    await click("[data-test-pop-up-menu='icon']");

    assert.dom("[data-test-pop-up-menu='icon']").exists();
    assert.dom("[data-test-pop-up-menu='background']").exists();
    assert.dom("[data-test-pop-up-menu='menu']").exists();
    assert.dom("[data-test-pop-up-menu='menu'] h2").hasText(label);

    await click("[data-test-pop-up-menu='background']");

    assert.dom("[data-test-pop-up-menu='icon']").exists();
    assert.dom("[data-test-pop-up-menu='background']").doesNotExist();
    assert.dom("[data-test-pop-up-menu='menu']").doesNotExist;
  });
});
