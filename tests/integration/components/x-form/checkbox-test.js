import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";

module("Integration | Component | x-form/checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("it managa isActive correctly", async function (assert) {
    const property = "list";
    const objects = A([
      {
        id: 1,
        title: "test-1",
      },
      {
        id: 2,
        title: "test-2",
      },
    ]);
    const changeset = {
      id: 1,
      list: new Promise((resolve) => resolve(A([objects.firstObject]))),
    };
    this.set("property", property);
    this.set("objects", objects);
    this.set("changeset", changeset);

    const activeClass = "active";
    this.set("activeClass", activeClass);

    await render(hbs`
    {{#each this.objects as |object|}}
      <XForm::Checkbox data-test-button="{{object.id}}" @label={{object.title}} @value={{object}} 
        @changeset={{this.changeset}} @property={{this.property}} 
        @activeClass={{this.activeClass}} />
    {{/each}}
    `);

    assert
      .dom(`[data-test-button='${objects[0].id}']`)
      .exists()
      .hasClass(activeClass);
    assert
      .dom(`[data-test-button='${objects[1].id}']`)
      .exists()
      .doesNotHaveClass(activeClass);

    await click(`[data-test-button='${objects[0].id}']`);

    assert
      .dom(`[data-test-button='${objects[0].id}']`)
      .exists()
      .doesNotHaveClass(activeClass);
  });

  test("it manage changeset correctly", async function (assert) {
    const property = "list";
    const objects = A([
      {
        id: 1,
        title: "test-1",
      },
      {
        id: 2,
        title: "test-2",
      },
    ]);
    const changeset = {
      id: 1,
      list: new Promise((resolve) => resolve(A([objects.firstObject]))),
    };
    this.set("property", property);
    this.set("objects", objects);
    this.set("changeset", changeset);

    await render(hbs`
    {{#each this.objects as |object|}}
      <XForm::Checkbox data-test-button="{{object.id}}" @label={{object.title}} @value={{object}} 
        @changeset={{this.changeset}} @property={{this.property}} 
        />
    {{/each}}
    `);

    const changesetList = await changeset.list;

    assert.equal(changesetList.length, 1, "One option is active");

    await click(`[data-test-button='${objects[1].id}']`);

    assert.equal(changesetList.length, 2, "Both options are active");

    await click(`[data-test-button='${objects[0].id}']`);
    await click(`[data-test-button='${objects[1].id}']`);

    assert.equal(changesetList.length, 0, "None option is active");
  });
});
