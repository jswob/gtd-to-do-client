import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class SignInRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.isAuthenticated) {
      const user_id = this.session.data.authenticated.user_id;
      return this.transitionTo("user", user_id);
    }
  }

  async model() {
    return this.store.createRecord("user", {});
  }

  @action willTransition() {
    this.controller.model.deleteRecord();
  }
}
