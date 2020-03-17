import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | x-form", function(hooks) {
  setupRenderingTest(hooks);

  test("it has all elements", async function(assert) {
    await render(hbs`<XForm></XForm>`);

    assert.dom("[data-test-form]").exists();
    assert.dom("[data-test-form-title]").exists();
  });

  test("it renders title", async function(assert) {
    await render(hbs`<XForm @title="some-title"></XForm>`);

    assert.dom("[data-test-form-title]").hasText("some-title");
  });

  test("it renders block content", async function(assert) {
    await render(hbs`
    <XForm>
      <p data-test-test-text>some-text</p>
    </XForm>
    `);

    assert
      .dom("[data-test-test-text]")
      .exists()
      .hasText("some-text");
  });
});
