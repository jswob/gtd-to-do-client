import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { getOwner } from "@ember/application";

export default class UserFormComponent extends Component {
  @service router;

  @action async manipulateUser(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        // Save collection changes
        await changeset.save();
        // Refresh user model
        await getOwner(this).lookup("route:user").refresh();
        // Move user to user.collections.collection
        return this.router.transitionTo("user.profile");
      }
    } catch (error /* { errors } */) {
      throw error;
      // errors.forEach((error) => {
      //   for (let [key, value] of Object.entries(error)) {
      //     changeset.pushErrors(key, `${key} ${value}`);
      //   }
      // });
    }
  }
}
