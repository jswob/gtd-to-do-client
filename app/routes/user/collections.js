import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { hash } from "rsvp";

export default class UserCollectionsRoute extends Route {
  @service currentData;

  model() {
    return hash({
      buckets: this.store.findAll("bucket"),
      collections: this.store.query("collection", {
        filter: {
          bucket_id: null,
        },
      }),
    });
  }
}
