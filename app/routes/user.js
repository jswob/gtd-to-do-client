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
    const token_user_id = this.session.data.authenticated.user_id;

    if (token_user_id != user_id)
      return this.transitionTo("user", token_user_id);

    try {
      const fetchedUser = await this.store.findRecord("user", user_id);
      this.transitionTo("user.collections", fetchedUser);
    } catch (error) {
      throw error;
    }
  }
}
