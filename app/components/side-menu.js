import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { getOwner } from "@ember/application";

export default class SideMenuComponent extends Component {
  constructor() {
    super(...arguments);

    this.containersData = getOwner(this).lookup(
      "route:user.collections"
    ).currentModel;
  }

  @service currentData;

  @tracked isOpen = false;

  @action
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
