import RESTAdapter from "@ember-data/adapter/rest";
import ENV from "gtd-to-do-client/config/environment";
import DataAdapterMixin from "ember-simple-auth/mixins/data-adapter-mixin";
import { computed } from "@ember/object";

export default class ApplicationAdapter extends RESTAdapter.extend(
  DataAdapterMixin
) {
  host = ENV.api.host;
  namespace = ENV.api.namespace;

  @computed("session.data.authenticated.token")
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers[
        "Authorization"
      ] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }
}
