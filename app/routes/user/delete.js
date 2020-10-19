import Route from "@ember/routing/route";

export default class UserDeleteRoute extends Route {
  model() {
    return this.modelFor("user");
  }
}
