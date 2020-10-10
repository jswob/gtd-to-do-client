import Route from "@ember/routing/route";

export default class UserCollectionsCollectionListEditRoute extends Route {
  async model() {
    const collection = await this.modelFor("user.collections.collection");
    const list = await this.modelFor("user.collections.collection.list");
    list.set("collection", collection);
    return list;
  }
}
