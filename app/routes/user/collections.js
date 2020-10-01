import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import { hash } from "rsvp";

export default class UserCollectionsRoute extends Route {
  @service currentData;

  async model() {
    try {
      const model = await hash({
        buckets: await this.store.findAll("bucket"),
        collections: await this.store.query("collection", {
          filter: {
            bucket_id: null,
          },
        }),
      });

      this.currentData.bucketsAndCollections = model;

      return model;
    } catch (error) {
      throw error;
    }
  }
}
