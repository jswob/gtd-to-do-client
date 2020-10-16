import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class TaskFormComponent extends Component {
  @action async manipulateTask(changeset) {
    await changeset.validate();
    try {
      if (changeset.isValid) {
        const response = await changeset.save();
        if (this.args.clearAction) this.args.clearAction();
        return response;
      } else {
        return false;
      }
    } catch ({ errors }) {
      errors.forEach((error) => {
        for (let [key, value] of Object.entries(error)) {
          changeset.pushErrors(key, `${key} ${value}`);
        }
      });
    }
  }
}
