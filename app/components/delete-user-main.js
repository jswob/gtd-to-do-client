import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class DeleteUserMainComponent extends Component {
  @service currentData;

  @action async logoutUser() {
    await this.currentData.logout();
  }
}
