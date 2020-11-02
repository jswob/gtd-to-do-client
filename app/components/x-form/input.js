import Component from "@glimmer/component";
import { computed } from "@ember/object";

export default class XFormInputComponent extends Component {
  constructor() {
    super(...arguments);

    let randomIdentifier = Math.round(Math.random() * 100000000);
    this.inputID = `input-${randomIdentifier}`;
  }

  get basicClasses() {
    let placeholderColor = this.args.placeholderColor;
    const color = this.args.color;
    if (!placeholderColor) placeholderColor = color;
    return ` text-${color} border-${color} placeholder-${placeholderColor}`;
  }

  get errorClasses() {
    const color = this.args.errorColor;
    return ` text-${color} border-${color} placeholder-${color}`;
  }
  get classes() {
    if (this.error) return this.errorClasses;

    return this.basicClasses;
  }

  get error() {
    let { changeset, property } = this.args;
    if (!changeset.errors.length) return null;

    let error = changeset.errors.find((error) => {
      if (error.key === property) {
        return true;
      }
    });

    if (error && Array.isArray(error.validation)) {
      return error.validation[0];
    } else if (error) return error.validation;
    else return null;
  }
}
