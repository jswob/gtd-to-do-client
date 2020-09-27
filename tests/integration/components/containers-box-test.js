import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { A } from "@ember/array";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | containers-box", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders all data correctly", async function (assert) {
    const model = {
      buckets: A([
        {
          id: 1,
          title: "some1",
          collections: A([
            { id: 1, title: "some1" },
            { id: 2, title: "some2" },
          ]),
        },
        { id: 2, title: "some2" },
      ]),
      collections: A([
        { id: 3, title: "some3" },
        { id: 4, title: "some4" },
      ]),
    };
    this.set("model", model);
    await render(hbs`<ContainersBox @model={{this.model}} />`);

    assert
      .dom("[data-test-containers-box='bucket']")
      .exists({ count: model.buckets.length });

    assert
      .dom("[data-test-containers-box='collection']")
      .exists({ count: model.collections.length });
  });
});
