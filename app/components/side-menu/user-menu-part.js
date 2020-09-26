import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class SideMenuUserMenuPartComponent extends Component {
  @service currentData;
  @service router;

  @action
  transtionToProfile() {
    this.router.transitionToRoute("user.profile");
  }
}
