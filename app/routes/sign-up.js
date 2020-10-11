import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class SignUpRoute extends Route {
  @service session;

  beforeModel() {
    if (this.session.isAuthenticated) {
      const user_id = this.session.data.authenticated.user_id;
      return this.transitionTo("user", user_id);
    }
  }

  model() {
    return this.store.createRecord("user", {});
  }

  @action willTransition() {
    const model = this.controller.model;
    if (!model.email) model.deleteRecord();
  }
}
