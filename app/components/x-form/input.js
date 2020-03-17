import Component from "@glimmer/component";

export default class XFormInputComponent extends Component {
  constructor() {
    super(...arguments);

    let randomIdentifier = Math.round(Math.random() * 100000000);
    this.inputID = `input-${randomIdentifier}`;
  }

  get isError() {
    if (this.args.errorMessage) return true;
    else return false;
  }
}
