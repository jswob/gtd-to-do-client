import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class MainPageComponent extends Component {
  constructor(owner, args) {
    super(owner, args);
  }

  @service currentData;

  @tracked activeList;
}
