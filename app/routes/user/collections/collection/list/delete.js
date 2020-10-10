import Route from "@ember/routing/route";

export default class UserCollectionsCollectionListDeleteRoute extends Route {
  model() {
    return this.modelFor("user.collections.collection.list");
  }
}
