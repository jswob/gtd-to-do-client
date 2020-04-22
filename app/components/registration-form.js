import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class RegistrationFormComponent extends Component {
  @service session;

  @action async createUser(changeset) {
    await changeset.validate();
    if (changeset.isValid) {
      let model = await changeset.save();
      return this.session.authenticate(
        "authenticator:oauth2",
        model.email,
        model.password
      );
    }
  }

  @action rollback(changeset) {
    return changeset.rollback();
  }
}
