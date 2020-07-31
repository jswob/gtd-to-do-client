import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class SessionDropButtonComponent extends Component {
  @service session;

  @action dropSession() {
    if (this.session.isAuthenticated) {
      return this.session.invalidate();
    }
  }
}
