import Route from "@ember/routing/route";
import { hash } from "rsvp";

export default class UserCollectionsCollectionEditRoute extends Route {
  async model() {
    const buckets = await this.modelFor("user.collections").buckets;
    const collection = await this.modelFor("user.collections.collection");
    const bucket = await collection.bucket;

    if (bucket) {
      const currentBucket = await this.store.findRecord(
        "bucket",
        bucket.get("id")
      );
      await buckets.toArray().pushObject(currentBucket);
    }

    return hash({
      collection: collection,
      buckets: buckets,
    });
  }
}
