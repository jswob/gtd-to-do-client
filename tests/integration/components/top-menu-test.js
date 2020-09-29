import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | top-menu", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders label", async function (assert) {
    const testLabel = "something1";
    const testYield = "something2";
    this.set("testLabel", testLabel);
    this.set("testYield", testYield);

    await render(
      hbs`<TopMenu @label={{this.testLabel}}>{{this.testYield}}</TopMenu>`
    );

    assert.dom("[data-test-top-menu='center']").exists().hasText(testLabel);
    assert.dom("[data-test-top-menu='right']").exists().hasText(testYield);
    assert.dom("[data-test-top-menu='side-menu']").doesNotExist();
  });

  test("it option is enabled renders side-menu", async function (assert) {
    const sideNav = true;
    this.set("sideNav", sideNav);

    await render(hbs`<TopMenu @sideNav={{this.sideNav}} />`);

    assert.dom("[data-test-top-menu='side-menu']").exists();
  });
});
