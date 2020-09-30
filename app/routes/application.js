import Route from "@ember/routing/route";
// import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class ApplicationRoute extends Route {
  @action
  willTransition(transition) {
    const previousRouteName = transition.from.name;

    if (
      !previousRouteName.includes(".new") &&
      !previousRouteName.includes(".edit") &&
      !previousRouteName.includes(
        ".delete" && !previousRouteName.includes(".profile")
      )
    )
      localStorage.previousRouteName = transition.from.name;
  }
}
