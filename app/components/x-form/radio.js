import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class XFormRadioComponent extends Component {
  get isActive() {
    const { changeset, value, property } = this.args;

    if (!changeset[property]) return false;

    if (changeset[property].get("id") == value.get("id")) return true;
    return false;
  }

  @action
  async toggleActive() {
    const { value, changeset, property } = this.args;

    if (!this.isActive) changeset[property] = value;
    else changeset[property] = null;
  }
}
