import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | none-list-menu", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders all data", async function (assert) {
    await render(hbs`<NoneListMenu />`);

    assert
      .dom("[data-test-none-list-menu-text]")
      .exists()
      .hasText("Nie utworzyłeś jeszcze żadnej listy zadań do wykonania!");

    assert
      .dom("[data-test-none-list-menu-link]")
      .exists()
      .hasText("UTWÓRZ LISTĘ");
  });
});
