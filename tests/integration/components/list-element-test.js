import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { A } from "@ember/array";

module("Integration | Component | list-element", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup("service:store");
    const lists = A([
      store.createRecord("list", { id: 0, title: "some_0" }),
      store.createRecord("list", { id: 1, title: "some_1" }),
    ]);
    const action = (list) => {
      this.set("currentList", list);
    };

    this.set("lists", lists);
    this.set("action", action);
    this.set("currentList", lists.firstObject);
  });

  test("it properly fires passed action", async function (assert) {
    await render(hbs`
      {{#each this.lists as |list|}}
        <ListElement data-test-list-element="{{list.id}}" @list={{list}} @currentList={{this.currentList}} @setListAction={{this.action}} />
      {{/each}}
    `);

    assert.equal(this.get("currentList"), this.get("lists")[0]);

    await click("[data-test-list-element='1']");

    assert.equal(this.get("currentList"), this.get("lists")[1]);

    await click("[data-test-list-element='0']");

    assert.equal(this.get("currentList"), this.get("lists")[0]);
  });

  test("it properly manage active and sets classes", async function (assert) {
    const classes = "some1";
    const activeClasses = "some2";
    const unactiveClasses = "some3";

    this.set("classes", classes);
    this.set("activeClasses", activeClasses);
    this.set("unactiveClasses", unactiveClasses);

    await render(hbs`
      {{#each this.lists as |list|}}
        <ListElement data-test-list-element="{{list.id}}" class={{this.classes}} @activeClasses={{this.activeClasses}} 
          @unactiveClasses={{this.unactiveClasses}} @list={{list}} @currentList={{this.currentList}} @setListAction={{this.action}} />
      {{/each}}
    `);

    assert.dom("[data-test-list-element='0']").hasClass(activeClasses);

    assert.dom("[data-test-list-element='1']").hasClass(unactiveClasses);

    await click("[data-test-list-element='1']");

    assert.dom("[data-test-list-element='1']").hasClass(activeClasses);

    assert.dom("[data-test-list-element='0']").hasClass(unactiveClasses);
  });
});
