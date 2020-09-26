import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | side-menu", function (hooks) {
  setupRenderingTest(hooks);

  test("it appears on icon click and disappears on background click", async function (assert) {
    const label = "some text";
    this.set("label", label);

    await render(hbs`<SideMenu />`);

    assert.dom("[data-test-side-menu='icon']").exists();
    assert
      .dom("[data-test-side-menu='background']")
      .hasNoClass("bg-active-open");
    assert.dom("[data-test-side-menu='aside']").hasNoClass("translate-x-0");

    await click("[data-test-side-menu='icon']");

    assert.dom("[data-test-side-menu='icon']").exists();
    assert.dom("[data-test-side-menu='background']").hasClass("bg-active-open");
    assert.dom("[data-test-side-menu='aside']").hasClass("translate-x-0");

    await click("[data-test-side-menu='background']");

    assert.dom("[data-test-side-menu='icon']").exists();
    assert
      .dom("[data-test-side-menu='background']")
      .hasNoClass("bg-active-open");
    assert.dom("[data-test-side-menu='aside']").hasNoClass("translate-x-0");
  });
});
