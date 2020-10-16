import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class DeleteTasksComponent extends Component {
  @action
  deleteTasks(tasks) {
    tasks.forEach((task) => task.destroyRecord());
  }
}
