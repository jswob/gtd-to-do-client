import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | collection-container", function (hooks) {
  setupRenderingTest(hooks);

  test("it properly generates link", async function (assert) {
    const model = {
      id: 1,
      title: "some",
    };
    this.set("model", model);
    await render(hbs`<CollectionContainer @collection={{this.model}} />`);

    assert.dom("[data-test-collection-container='link']").hasText(model.title);
  });
});
