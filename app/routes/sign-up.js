import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class SignUpRoute extends Route {
  @service session;

  model() {
    if (this.session.isAuthenticated) {
      return this.transitionTo("user");
    }
    return this.store.createRecord("user", {});
  }

  @action willTransition() {
    this.controller.model.deleteRecord();
  }
}
