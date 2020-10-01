import Service from "@ember/service";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { computed } from "@ember/object";

export default class CurrentDataService extends Service {
  @service session;
  @service store;

  @tracked user = null;

  @tracked bucketsAndCollections = null;

  @computed("localStorage.previousRouteName")
  get previousRouteName() {
    return localStorage.previousRouteName;
  }

  @computed("localStorage.previousRouteModel")
  get previousRouteModel() {
    if (localStorage.previousRouteModel) return localStorage.previousRouteName;
    return null;
  }

  @action
  async logout() {
    const models = ["user", "bucket", "collection", "list", "task"];

    this.user = null;

    models.forEach(async (modelName) => await this.store.unloadAll(modelName));

    await this.session.invalidate();
  }
}
