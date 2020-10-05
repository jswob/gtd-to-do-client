import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import Changeset from "ember-changeset";
import CreateBucketValidations from "gtd-to-do-client/validations/create-bucket";
import lookupValidator from "ember-changeset-validations";
import { A } from "@ember/array";

module("Integration | Component | create-bucket", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const bucket = this.owner
      .lookup("service:store")
      .createRecord("bucket", {});

    const collections = A([
      this.owner
        .lookup("service:store")
        .createRecord("collection", { id: 1, title: "some1" }),
      this.owner
        .lookup("service:store")
        .createRecord("collection", { id: 2, title: "some2" }),
    ]);
    const changeset = new Changeset(
      bucket,
      lookupValidator(CreateBucketValidations)
    );

    this.set("changeset", changeset);
    this.set("collections", collections);
  });

  test("it renders all data", async function (assert) {
    await render(
      hbs`
        <CreateBucket @changeset={{this.changeset}} 
          @collections={{this.collections}} />`
    );

    assert
      .dom("[data-test-create-bucket-input]")
      .exists()
      .hasProperty("placeholder", "np. Agendy");

    assert
      .dom("[data-test-create-bucket-collection]")
      .exists({ count: this.get("collections").length });

    assert.dom("[data-test-create-bucket-submit]").exists();
  });

  test("it can't save bucket if changeset is invalid", async function (assert) {
    await render(
      hbs`
        <CreateBucket @changeset={{this.changeset}} 
          @collections={{this.collections}} />`
    );

    await fillIn("[data-test-create-bucket-input]", "");
    await click("[data-test-create-bucket-submit]");

    const formText = document
      .querySelector(`[data-test-form]`)
      .textContent.trim();

    assert.ok(formText.includes("Title can't be blank"));
  });
});
