import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | main-page/navigation", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });
    const list = this.server.create("list", { owner, collection });

    this.set("user", owner);
    this.set("collection", collection);
    this.set("currentList", list);
  });

  test("it renders all data", async function (assert) {
    await render(
      hbs`<MainPage::Navigation @currentList={{this.currentList}} @collection={{this.collection}} />`
    );

    assert.dom("[data-test-navigation-icon]").exists().hasText("more_vert");

    await click("[data-test-navigation-icon]");

    assert.dom("[data-test-pop-up-menu='menu']").exists();
    assert
      .dom("[data-test-pop-up-menu='menu'] h2")
      .exists()
      .hasText(this.currentList.title);
    assert
      .dom("[data-test-navigation-new-list]")
      .exists()
      .hasText("Nowa lista");
    assert
      .dom("[data-test-navigation-edit-list]")
      .exists()
      .hasText("Edytuj listę");
    assert
      .dom("[data-test-navigation-delete-list]")
      .exists()
      .hasText("Usuń listę");

    this.set(
      "collection",
      this.server.create("collection", { owner: this.user })
    );

    assert.dom("[data-test-arrow-back]").exists().hasText("arrow_back");
  });
});
