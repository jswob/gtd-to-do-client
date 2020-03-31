import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class RegistrationFormComponent extends Component {
  @action async createUser(changeset) {
    await changeset.validate();
    if (changeset.isValid) {
      return changeset.save();
    }
  }

  @action rollback(changeset) {
    return changeset.rollback();
  }
}
