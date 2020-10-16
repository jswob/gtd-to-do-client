import Component from "@glimmer/component";
import { action, computed } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class CheckboxComponent extends Component {
  @computed("_doneHelper")
  get isActive() {
    const { element, property } = this.args;
    return element.get(property);
  }

  @tracked
  _doneHelper;

  @action
  async toggleDone() {
    const { element, property } = this.args;
    const newValue = !element.get(property);

    element.set(property, newValue);
    this._doneHelper = newValue;
    await element.save();
  }
}
