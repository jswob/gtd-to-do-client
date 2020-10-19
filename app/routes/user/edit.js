import Route from "@ember/routing/route";

export default class UserEditRoute extends Route {
  model() {
    return this.modelFor("user");
  }
}
