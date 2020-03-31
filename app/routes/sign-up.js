import Route from "@ember/routing/route";

export default class SignUpRoute extends Route {
  async model() {
    return this.store.createRecord("user", {});
  }
}
