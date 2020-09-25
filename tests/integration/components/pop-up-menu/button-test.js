import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | pop-up-menu/button", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders a transtion button if route is presented", async function (assert) {
    const route = "user";
    this.set("route", route);

    await render(
      hbs`<PopUpMenu::Button @route={{this.route}}>TEST</PopUpMenu::Button>`
    );

    assert.dom("[data-test-pop-up-menu='button-transition']").exists();
  });

  test("it renders an action button if route isn't presented", async function (assert) {
    const testValue = "some text";
    const action = () => {
      this.set("testValue", testValue);
    };
    this.set("action", action);

    await render(
      hbs`<PopUpMenu::Button @action={{this.action}}>TEST</PopUpMenu::Button>`
    );

    assert.dom("[data-test-pop-up-menu='button-action']").exists();

    await click("[data-test-pop-up-menu='button-action']");

    assert.equal(this.testValue, testValue);
  });
});
