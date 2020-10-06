import Route from "@ember/routing/route";

export default class UserBucketDeleteRoute extends Route {
  model() {
    return this.modelFor("user.bucket");
  }
}
