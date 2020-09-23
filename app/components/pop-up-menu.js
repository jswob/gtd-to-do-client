import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class PopUpMenuComponent extends Component {
  @tracked isOpened = false;

  @action
  toggleMenu() {
    this.isOpened = !this.isOpened;
  }

  @action
  nothing() {
    //It's literary nothing in here!
  }
}
