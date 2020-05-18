import RESTAdapter from "@ember-data/adapter/rest";
import ENV from "gtd-to-do-client/config/environment";

export default class ApplicationAdapter extends RESTAdapter {
  host = ENV.api.host;
  namespace = ENV.api.namespace;
}
