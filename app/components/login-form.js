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
        const response = await this.session.authenticate(
          "authenticator:oauth2",
          email,
          password
        );

        return response
      }
    } catch ({ responseJSON }) {
      const { errors } = responseJSON;

      if (errors.detail) {
        changeset.pushErrors("email", "Bad email")
        changeset.pushErrors("password", "or password")
        return
      }
      errors.forEach((error) => {
        for (let [key, value] of Object.entries(error)) {
          changeset.pushErrors(key, `${key} ${value}`);
        }
      });
    }
  }
}
