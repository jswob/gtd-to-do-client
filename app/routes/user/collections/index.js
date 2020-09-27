import Route from "@ember/routing/route";

export default class UserCollectionsIndexRoute extends Route {
  model() {
    return this.modelFor("user.collections");
  }
}
