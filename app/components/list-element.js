import Component from "@glimmer/component";

export default class ListElementComponent extends Component {
  get isActive() {
    const { currentList, list } = this.args;

    if (currentList.id === list.id) return true;
    return false;
  }
}
