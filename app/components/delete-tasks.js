import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class DeleteTasksComponent extends Component {
  @action
  deleteTasks(tasks) {
    try {
      tasks.forEach((task) => task.destroyRecord());
      return true;
    } catch (error) {
      throw error;
    }
  }
}
