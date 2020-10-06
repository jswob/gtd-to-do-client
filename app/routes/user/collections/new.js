import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { hash } from "rsvp";

export default class UserCollectionsNewRoute extends Route {
  async model() {
    return hash({
      collection: this.store.createRecord("collection", {}),
      buckets: this.modelFor("user.collections").buckets,
    });
  }

  @action willTransition() {
    this.controller.model.collection.deleteRecord();
  }
}
