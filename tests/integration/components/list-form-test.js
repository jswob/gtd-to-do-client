import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import ListValidations from "gtd-to-do-client/validations/list";
import lookupValidator from "ember-changeset-validations";

module("Integration | Component | list-form", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");

    const collection = store.createRecord("collection", {});

    const list = store.createRecord("list", {
      collection: collection,
      title: "some title",
    });

    const changeset = new Changeset(list, lookupValidator(ListValidations));

    this.set("changeset", changeset);
    this.set("list", list);
  });

  test("it renders all data", async function (assert) {
    const buttonLabel = "Utwórz listę";
    this.set("buttonLabel", buttonLabel);

    await render(
      hbs`<ListForm @changeset={{this.changeset}} @buttonLabel={{this.buttonLabel}} />`
    );

    assert
      .dom("[data-test-list-form-input]")
      .exists({ count: 1 })
      .hasValue(this.get("changeset.title"));

    assert
      .dom("[data-test-list-form-submit]")
      .exists({ count: 1 })
      .hasText(buttonLabel);
  });

  test("it can't save form if changeset has errors", async function (assert) {
    this.set("changeset.title", null);
    this.set("changeset.collection", null);

    await render(hbs`<ListForm @changeset={{this.changeset}} />`);
    await click("[data-test-list-form-submit]");

    assert
      .dom("[data-test-input='error-span']")
      .exists({ count: 1 })
      .hasText("Title can't be blank");
  });
});
