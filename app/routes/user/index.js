import Route from "@ember/routing/route";

export default class UserIndexRoute extends Route {
  beforeModel() {
    this.transitionTo("user.collections");
  }
}
