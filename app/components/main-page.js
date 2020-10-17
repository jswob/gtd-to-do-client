import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action, computed } from "@ember/object";
import { A } from "@ember/array";

export default class MainPageComponent extends Component {
  @tracked
  selectedList = null;

  @tracked
  activeTasks = A([]);

  @computed("args.model", "selectedList")
  get currentList() {
    if (this.args.model.lists.includes(this.selectedList))
      return this.selectedList;

    return this.args.model.lists.firstObject;
  }

  @action
  resetActiveTasks() {
    this.activeTasks = A([]);
  }

  @action chooseList(list) {
    this.selectedList = list;
  }
}
