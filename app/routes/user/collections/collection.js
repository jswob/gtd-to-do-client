import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class UserCollectionsCollectionRoute extends Route {
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