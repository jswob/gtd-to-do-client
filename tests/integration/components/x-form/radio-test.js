import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import Changeset from "ember-changeset";
import CollectionValidations from "gtd-to-do-client/validations/collection";
import lookupValidator from "ember-changeset-validations";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";

module("Integration | Component | x-form/radio", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");
    const buckets = A([
      store.createRecord("bucket", { id: 0, title: "some_b_0" }),
      store.createRecord("bucket", { id: 1, title: "some_b_1" }),
    ]);

    const collection = store.createRecord("collection", {
      id: 0,
      title: "some_c_0",
      bucket: buckets.firstObject,
    });

    const changeset = new Changeset(
      collection,
      lookupValidator(CollectionValidations)
    );

    this.set("buckets", buckets);
    this.set("changeset", changeset);
    this.set("property", "bucket");
  });

  test("it manage isActive correctly", async function (assert) {
    const activeClass = "active";
    this.set("activeClass", activeClass);

    await render(hbs`
    {{#each this.buckets as |bucket|}}
      <XForm::Radio data-test-button="{{bucket.id}}" @label={{bucket.title}} @value={{bucket}}
        @changeset={{this.changeset}} @property={{this.property}}
        @activeClass={{this.activeClass}} />
    {{/each}}
    `);

    assert
      .dom(`[data-test-button='${this.get("buckets")[0].id}']`)
      .hasClass(activeClass);
    assert
      .dom(`[data-test-button='${this.get("buckets")[1].id}']`)
      .doesNotHaveClass(activeClass);

    await click(`[data-test-button='${this.get("buckets")[1].id}']`);

    assert
      .dom(`[data-test-button='${this.get("buckets")[0].id}']`)
      .doesNotHaveClass(activeClass);
    assert
      .dom(`[data-test-button='${this.get("buckets")[1].id}']`)
      .hasClass(activeClass);

    await click(`[data-test-button='${this.get("buckets")[1].id}']`);

    assert
      .dom(`[data-test-button='${this.get("buckets")[0].id}']`)
      .doesNotHaveClass(activeClass);
    assert
      .dom(`[data-test-button='${this.get("buckets")[1].id}']`)
      .doesNotHaveClass(activeClass);
  });

  test("it manage changeset correctly", async function (assert) {
    await render(hbs`
    {{#each this.buckets as |bucket|}}
      <XForm::Radio data-test-button="{{bucket.id}}" @label={{bucket.title}} @value={{bucket}}
        @changeset={{this.changeset}} @property={{this.property}} />
    {{/each}}
    `);

    assert.equal(
      this.get(`changeset.${this.get("property")}.id`),
      0,
      "First option is active"
    );

    await click(`[data-test-button='${this.get("buckets")[1].get("id")}']`);

    assert.equal(
      this.get(`changeset.${this.get("property")}.id`),
      1,
      "Second option is active"
    );

    await click(`[data-test-button='${this.get("buckets")[1].get("id")}']`);

    assert.notOk(
      this.get(`changeset.${this.get("property")}.id`),
      "None option is active"
    );
  });
});
