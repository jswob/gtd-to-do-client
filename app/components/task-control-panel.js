import Component from "@glimmer/component";
import { computed, action } from "@ember/object";
import TaskValidations from "gtd-to-do-client/validations/task";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";

export default class TaskControlPanelComponent extends Component {
  @service store;
  TaskValidations = TaskValidations;

  constructor(_owner, args) {
    super(...arguments);

    this.refreshNewTask();
  }

  @tracked newTask;

  @computed("args.currentList", "newTask")
  get changeset() {
    const changeset = new Changeset(
      this.newTask,
      lookupValidator(TaskValidations)
    );

    changeset.set("list", this.args.currentList);

    return changeset;
  }

  @computed("args.activeTasks.length")
  get isOnlyOneActive() {
    if (this.args.activeTasks.length == 1) return true;
    return false;
  }

  @action
  refreshNewTask() {
    this.newTask = this.store.createRecord("task", {
      isDone: false,
    });
  }

  willDestroy() {
    if (this.newTask && !this.newTask.title) this.newTask.deleteRecord();
  }
}
