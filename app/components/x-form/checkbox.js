import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class XFormCheckboxComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    const { value, changeset, property } = this.args;
    const changesetList = changeset[property];

    if (changesetList.then) {
      changesetList.then((list) => (this.isActive = list.includes(value)));
    } else this.isActive = changesetList.includes(value);
  }

  @tracked isActive;

  @action
  async toggleActive() {
    const { value, changeset, property } = this.args;
    const changesetList = await changeset[property];

    if (this.isActive) {
      changesetList.removeObject(value);
    } else changesetList.pushObject(value);

    this.isActive = !this.isActive;
  }
}
