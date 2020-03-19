import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | x-form/redirection", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders all sended data", async function(assert) {
    this.set("infoText", "Some info text");
    this.set("linkText", "Some link text");
    this.set("route", "sign-in");

    await render(
      hbs`<XForm::Redirection @infoText={{this.infoText}} @linkText={{this.linkText}} @route={{this.route}} />`
    );

    assert
      .dom("[data-test-form='redirection']")
      .exists()
      .hasText("Some info text Some link text");

    assert
      .dom("[data-test-form='redirection-link']")
      .exists()
      .hasText("Some link text");
  });
});
