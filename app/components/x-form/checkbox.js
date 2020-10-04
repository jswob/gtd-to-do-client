import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class XFormCheckboxComponent extends Component {
  constructor(owner, args) {
    super(owner, args);

    const { value, changeset, property } = this.args;
    const changesetList = changeset[property];

    changesetList
      .then((array) => {
        if (array.includes(value)) return (this.isActive = true);
        return (this.isActive = false);
      })
      .catch((error) => {
        throw error;
      });
  }

  @tracked isActive;

  @action
  async toggleActive() {
    const { value, changeset, property } = this.args;
    const changesetList = await changeset.list;

    if (this.isActive) {
      changesetList.removeObject(value);
    } else changesetList.pushObject(value);

    this.isActive = !this.isActive;
  }
}
