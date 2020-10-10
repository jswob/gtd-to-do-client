import Route from "@ember/routing/route";
import { action } from "@ember/object";

export default class UserCollectionsCollectionListsNewRoute extends Route {
  model() {
    const collection = this.modelFor("user.collections.collection");
    return this.store.createRecord("list", { collection: collection });
  }

  @action willTransition() {
    if (!this.controller.model.title) {
      this.controller.model.deleteRecord();
    }
  }
}
