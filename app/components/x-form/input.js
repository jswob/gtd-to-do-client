import Component from "@glimmer/component";

export default class XFormInputComponent extends Component {
  constructor() {
    super(...arguments);

    let randomIdentifier = Math.round(Math.random() * 100000000);
    this.inputID = `input-${randomIdentifier}`;
  }

  errorClasses = "inp border-red-500 text-red-500 placeholder-red-500 w-9/12";
  basicClasses = "inp text-light placeholder-green-200 w-9/12";

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

    if (error) return error.validation[0];
    return null;
  }
}
