import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action, computed } from "@ember/object";

export default class UserCollectionsCollectionIndexController extends Controller {
  @tracked
  selectedList = null;

  @computed("model", "selectedList")
  get currentList() {
    if (this.model.lists.includes(this.selectedList)) return this.selectedList;

    return this.model.lists.firstObject;
  }

  @action chooseList(list) {
    this.selectedList = list;
  }
}
