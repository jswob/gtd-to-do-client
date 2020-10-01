import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class SideMenuComponent extends Component {
  @service currentData;

  @tracked isOpen = false;

  @action
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
