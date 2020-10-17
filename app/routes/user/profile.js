import Route from "@ember/routing/route";

export default class UserProfileRoute extends Route {
  model() {
    return this.modelFor("user");
  }
}
