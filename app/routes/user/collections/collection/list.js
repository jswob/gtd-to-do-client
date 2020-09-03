import Route from "@ember/routing/route";

export default class UserCollectionsCollectionListRoute extends Route {
  async model({ list_id }) {
    try {
      const list = await this.findRecord("list", list_id);
      return list;
    } catch (error) {
      throw error;
    }
  }
}
