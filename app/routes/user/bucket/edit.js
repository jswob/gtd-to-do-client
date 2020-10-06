import Route from "@ember/routing/route";
import { hash } from "rsvp";

export default class UserBucketEditRoute extends Route {
  async model() {
    const bucket = await this.modelFor("user.bucket");
    return hash({
      bucket: bucket,
      freeCollections: await this.store.query("collection", {
        filter: {
          bucket_id: null,
        },
      }),
      bucketCollections: await this.store.query("collection", {
        filter: {
          bucket_id: bucket.id,
        },
      }),
    });
  }
}
