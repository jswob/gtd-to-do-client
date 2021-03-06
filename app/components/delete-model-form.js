import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class DeleteModelFormComponent extends Component {
  @service router;

  @action
  async deleteModel(model, transitionRoute) {
    const { callback } = this.args;
    try {
      await model.destroyRecord();

      if (callback) await callback();
      if (transitionRoute) this.router.transitionTo(transitionRoute);
    } catch (error) {
      throw error;
    }
  }
}
