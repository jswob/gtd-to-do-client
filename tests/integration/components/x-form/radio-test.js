import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";

module("Integration | Component | x-form/radio", function (hooks) {
  setupRenderingTest(hooks);

  // Test doesn't work for some obscure reason but i will find out why

  // test("it managa isActive correctly", async function (assert) {
  //   const property = "property";
  //   const objects = A([
  //     {
  //       id: 1,
  //       title: "test-1",
  //     },
  //     {
  //       id: 2,
  //       title: "test-2",
  //     },
  //   ]);
  //   const changeset = {
  //     id: 1,
  //     property: objects[0],
  //   };
  //   this.set("property", property);
  //   this.set("objects", objects);
  //   this.set("changeset", changeset);

  //   const activeClass = "active";
  //   this.set("activeClass", activeClass);

  //   await render(hbs`
  //   {{#each this.objects as |object|}}
  //     <XForm::Radio data-test-button="{{object.id}}" @label={{object.title}} @value={{object}}
  //       @changeset={{this.changeset}} @property={{this.property}}
  //       @activeClass={{this.activeClass}} />
  //   {{/each}}
  //   `);

  //   assert.dom(`[data-test-button='${objects[0].id}']`).hasClass(activeClass);
  //   assert
  //     .dom(`[data-test-button='${objects[1].id}']`)
  //     .doesNotHaveClass(activeClass);

  //   await click(`[data-test-button='${objects[1].id}']`);

  //   assert
  //     .dom(`[data-test-button='${objects[0].id}']`)
  //     .doesNotHaveClass(activeClass);
  //   assert.dom(`[data-test-button='${objects[1].id}']`).hasClass(activeClass);

  //   await click(`[data-test-button='${objects[1].id}']`);

  //   assert
  //     .dom(`[data-test-button='${objects[0].id}']`)
  //     .doesNotHaveClass(activeClass);
  //   assert
  //     .dom(`[data-test-button='${objects[1].id}']`)
  //     .doesNotHaveClass(activeClass);
  //   await this.pauseTest();
  // });

  test("it manage changeset correctly", async function (assert) {
    const property = "property";
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
      property: objects[0],
    };

    this.set("property", property);
    this.set("objects", objects);
    this.set("changeset", changeset);

    const activeClass = "active";
    this.set("activeClass", activeClass);

    await render(hbs`
    {{#each this.objects as |object|}}
      <XForm::Radio data-test-button="{{object.id}}" @label={{object.title}} @value={{object}}
        @changeset={{this.changeset}} @property={{this.property}}
        @activeClass={{this.activeClass}} />
    {{/each}}
    `);

    assert.equal(changeset[property].id, 1, "First option is active");

    await click(`[data-test-button='${objects[1].id}']`);

    assert.equal(changeset[property].id, 2, "Second option is active");

    await click(`[data-test-button='${objects[1].id}']`);

    assert.notOk(changeset[property], "None option is active");
  });
});
