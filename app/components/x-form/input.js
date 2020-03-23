import Component from "@glimmer/component";

export default class XFormInputComponent extends Component {
  constructor() {
    super(...arguments);

    let randomIdentifier = Math.round(Math.random() * 100000000);
    this.inputID = `input-${randomIdentifier}`;
  }

  get error() {
    let { changeset, property } = this.args;
    if (!changeset.errors.length) return null;

    let error = changeset.errors.find(error => {
      if (error.key === property) {
        return true;
      }
    });

    if (error) return error.validation[0];
    return null;
  }
}
