import RESTAdapter from "@ember-data/adapter/rest";

export default class ApplicationAdapter extends RESTAdapter {
  host = "http://localhost:4000";
  namespace = "/api";
}
