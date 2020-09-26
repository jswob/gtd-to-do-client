import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class SideMenuComponent extends Component {
  @tracked isOpen = false;

  @action
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}