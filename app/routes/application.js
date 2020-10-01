import Route from "@ember/routing/route";
// import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class ApplicationRoute extends Route {
  @action
  async willTransition(transition) {
    const previousRouteModel = await transition.from.attributes;
    const previousRouteName = transition.from.name;
    const unwantedRoutes = [".new", ".edit", ".profile", ".delete"];

    if (!checkIfInclude(previousRouteName, unwantedRoutes)) {
      if (previousRouteName != "user.collections.index") {
        localStorage.previousRouteModel = previousRouteModel;
      }
      localStorage.previousRouteName = transition.from.name;
    }
  }
}

function checkIfInclude(string, params) {
  for (let i = 0; i < params.length; i++)
    if (string.includes(params[i])) return true;

  return false;
}
