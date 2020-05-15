import Route from "@ember/routing/route";
import { action } from "@ember/object";

export default class SignInRoute extends Route {
  async model() {
    return this.store.createRecord("user", {});
  }

  @action willTransition() {
    this.controller.model.deleteRecord();
  }
}
