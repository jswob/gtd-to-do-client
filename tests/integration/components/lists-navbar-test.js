import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | lists-navbar", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    const owner = this.server.create("user", {});
    const collection = this.server.create("collection", { owner });

    this.set(
      "lists",
      A([
        this.server.create("list", { owner, collection }),
        this.server.create("list", { owner, collection }),
      ])
    );
    this.set("currentList", this.lists.firstObject);
    this.set("setListAction", (value) => {
      this.set("currentList", value);
    });
  });

  test("it renders all data and properly sets params", async function (assert) {
    await render(
      hbs`<ListsNavbar @lists={{this.lists}} @currentList={{this.currentList}} @setListAction={{this.setListAction}} />`
    );

    assert.dom("[data-test-list-element]").exists({ count: 2 });

    await click("[data-test-list-element-id='2']");

    assert.equal(this.currentList.id, 2, "It properly sets passed actions");
  });
});
