import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class PopUpFormComponent extends Component {
  @tracked isOpen = false;

  @action
  async triggerAction(callback) {
    await callback();
    await this.toggleOpen();
  }

  @action
  toggleOpen() {
    const { changeset, changesetRollbackProperty } = this.args;

    if (changeset && changesetRollbackProperty)
      changeset.rollbackProperty(changesetRollbackProperty);
    else if (changeset) changeset.rollback();

    this.isOpen = !this.isOpen;
  }

  @action
  stopPropagationAction() {
    // Do nothing
  }
}
