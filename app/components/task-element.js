import Component from "@glimmer/component";
import { computed, action } from "@ember/object";

export default class TaskElementComponent extends Component {
  _selectedClass = "bg-blue-300";
  _doneClass = "bg-green-400";
  _normalClass = "bg-gray-200 focus:bg-gray-200";

  @computed("args.task.isDone", "args.activeTasks.length")
  get currentClass() {
    const { activeTasks, task } = this.args;
    const isSelected = activeTasks.includes(task);
    const isDone = task.isDone;

    if (isSelected) return this._selectedClass;
    else if (isDone) return this._doneClass;
    else return this._normalClass;
  }

  @computed("currentClass")
  get currentButtonClass() {
    const { _doneClass, _selectedClass, currentClass } = this;

    if (currentClass == _doneClass) return "bg-green-700 text-white";
    else if (currentClass == _selectedClass) return "bg-blue-500 text-white";
    else return "bg-gray-400";
  }

  @action
  activateTask() {
    const { activeTasks, task } = this.args;

    if (activeTasks.includes(task)) activeTasks.removeObject(task);
    else activeTasks.pushObject(task);
  }
}
