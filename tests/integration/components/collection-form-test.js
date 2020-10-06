import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import CollectionValidations from "gtd-to-do-client/validations/collection";
import lookupValidator from "ember-changeset-validations";
import { A } from "@ember/array";

module("Integration | Component | collection-form", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const collection = this.owner
      .lookup("service:store")
      .createRecord("collection", {});

    const buckets = A([
      this.owner
        .lookup("service:store")
        .createRecord("bucket", { id: 1, title: "some1" }),
      this.owner
        .lookup("service:store")
        .createRecord("bucket", { id: 2, title: "some2" }),
    ]);
    const changeset = new Changeset(
      collection,
      lookupValidator(CollectionValidations)
    );

    this.set("changeset", changeset);
    this.set("buckets", buckets);
  });

  test("it renders all data", async function (assert) {
    const buttonLabel = "somthing";
    this.set("buttonLabel", buttonLabel);
    await render(
      hbs`
        <CollectionForm @changeset={{this.changeset}}
          @buckets={{this.buckets}} @buttonLabel={{this.buttonLabel}} />`
    );

    assert
      .dom("[data-test-collection-form-input]")
      .exists()
      .hasProperty("placeholder", "np. Najbliższe działania");

    assert
      .dom("[data-test-collection-form-bucket]")
      .exists({ count: this.get("buckets").length });

    assert
      .dom("[data-test-collection-form-submit]")
      .exists()
      .hasText(buttonLabel);
  });

  test("it can't save bucket if changeset is invalid", async function (assert) {
    await render(
      hbs`
        <CollectionForm @changeset={{this.changeset}}
          @buckets={{this.buckets}} />`
    );

    await fillIn("[data-test-collection-form-input]", "");
    await click("[data-test-collection-form-submit]");

    const formText = document
      .querySelector(`[data-test-form]`)
      .textContent.trim();

    assert.ok(formText.includes("Title can't be blank"));
  });
});
