import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class CurrentDataService extends Service {
  @tracked
  currentUser = null;
}
