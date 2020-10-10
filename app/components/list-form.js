import Component from "@glimmer/component";

import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { getOwner } from "@ember/application";

export default class ListFormComponent extends Component {
  @service router;

  @action async manipulateList(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        const collection = getOwner(this).lookup(
          "route:user.collections.collection"
        ).controller.model;
        // Save collection changes
        const list = await changeset.save();
        // Load changes from API
        await getOwner(this)
          .lookup("route:user.collections.collection")
          .refresh();
        // Move user to user.collections.collection
        return this.router.transitionTo(
          "user.collections.collection",
          collection
        );
      }
    } catch ({ errors }) {
      errors.forEach((error) => {
        for (let [key, value] of Object.entries(error)) {
          changeset.pushErrors(key, `${key} ${value}`);
        }
      });
    }
  }
}
