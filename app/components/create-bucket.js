import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class CreateBucketComponent extends Component {
  @service router;

  @action async createBucket(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        await changeset.save();
        // return this.router.transitionTo("user.collections.index");
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
