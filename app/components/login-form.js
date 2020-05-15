import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class LoginFormComponent extends Component {
  @service session;

  @action async login(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        let { email, password } = changeset;
        return this.session.authenticate(
          "authenticator:oauth2",
          email,
          password
        );
      }
    } catch (reason) {}
  }
}
