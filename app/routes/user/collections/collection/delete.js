import Route from "@ember/routing/route";

export default class UserCollectionsCollectionDeleteRoute extends Route {
  model() {
    return this.modelFor("user.collections.collection");
  }
}
