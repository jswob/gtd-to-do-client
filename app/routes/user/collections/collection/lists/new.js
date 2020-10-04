import Route from "@ember/routing/route";

export default class UserCollectionsCollectionListsNewRoute extends Route {
  model() {
    return this.modelFor("user.collections.collection");
  }
}
