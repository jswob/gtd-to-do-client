import Route from "@ember/routing/route";
import { action } from "@ember/object";
import { hash } from "rsvp";

export default class UserBucketsNewRoute extends Route {
  async model() {
    return hash({
      bucket: this.store.createRecord("bucket", {}),
      collections: await this.store.query("collection", {
        filter: {
          bucket_id: null,
        },
      }),
    });
  }

  @action willTransition() {
    this.controller.model.bucket.deleteRecord();
  }
}
