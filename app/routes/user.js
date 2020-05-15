import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class UserRoute extends Route {
  @service session;

  model() {
    if (!this.session.isAuthenticated) {
      return this.transitionTo("sign-in");
    }
  }
}
