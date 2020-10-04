import Route from "@ember/routing/route";

export default class UserCollectionsCollectionRoute extends Route {
  queryParams = {
    category: {
      refreshModel: true,
    },
  };

  async model({ collection_id }) {
    try {
      const collection = await this.store.findRecord(
        "collection",
        collection_id
      );

      return collection;
    } catch (error) {
      throw error;
    }
  }
}
