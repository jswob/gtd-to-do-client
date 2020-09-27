import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { A } from "@ember/array";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | bucket-container", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders all elements correctly", async function (assert) {
    const model = {
      id: 1,
      title: "some",
      collections: A([
        { id: 1, title: "some1" },
        { id: 2, title: "some2" },
      ]),
    };
    this.set("model", model);
    await render(hbs`<BucketContainer @bucket={{this.model}} />`);

    assert
      .dom("[data-test-bucket-container='collection']")
      .exists({ count: model.collections.length });

    await click("[data-test-bucket-container='menu-button']");

    assert
      .dom("[data-test-bucket-container='link-edit']")
      .exists()
      .hasText("Edytuj");

    assert
      .dom("[data-test-bucket-container='link-delete']")
      .exists()
      .hasText("Usuń");
  });
});
