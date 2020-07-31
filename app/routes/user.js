import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class UserRoute extends Route {
  @service session;

  beforeModel() {
    if (!this.session.isAuthenticated) {
      return this.transitionTo("sign-in");
    }
  }

  async model({ user_id }) {
    const user = await this.store.findRecord("user", user_id);
    return user;
  }
}
