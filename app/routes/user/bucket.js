import Route from "@ember/routing/route";

export default class UserBucketRoute extends Route {
  async model({ bucket_id }) {
    try {
      const bucket = this.store.findRecord("bucket", bucket_id);
      return bucket;
    } catch (error) {
      throw error;
    }
  }
}
