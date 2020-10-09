import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { hash } from "rsvp";

export default class UserCollectionsNewRoute extends Route {
  async model() {
    return hash({
      collection: await this.store.createRecord("collection", {}),
      buckets: await this.modelFor("user.collections").buckets,
    });
  }

  @action willTransition() {
    const collection = this.controller.model.collection;
    if (!collection.title) {
      collection.deleteRecord();
    }
  }
}
