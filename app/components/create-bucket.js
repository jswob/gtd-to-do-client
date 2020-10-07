import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { getOwner } from "@ember/application";

export default class CreateBucketComponent extends Component {
  @service router;

  @action async createBucket(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        // Save changes in changeset
        await changeset.save();
        // Load changes from API
        await getOwner(this).lookup("route:user.collections").refresh();
        // Transition to user.collections.index
        return this.router.transitionTo("user.collections.index");
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
