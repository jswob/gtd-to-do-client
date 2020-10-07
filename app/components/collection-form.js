import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { getOwner } from "@ember/application";

export default class CollectionFormComponent extends Component {
  @service router;

  @tracked activeBucket = null;

  @action async manipulateCollection(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        // Save collection changes
        const collection = await changeset.save();
        // Load changes from API
        await getOwner(this).lookup("route:user.collections").refresh();
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
