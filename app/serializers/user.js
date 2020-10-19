import ApplicationSerializer from "./application";
import { underscore } from "@ember/string";
import { get } from "@ember/object";

export default class UserSerializer extends ApplicationSerializer {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    var fields = get(primaryModelClass, "fields");

    if (payload.users) {
      payload.users.forEach((user) =>
        serializeUnderscoredProperties(user, fields)
      );
    } else {
      serializeUnderscoredProperties(payload.user, fields);
    }

    return super.normalizeResponse(...arguments);
  }

  serialize(snapshot, _options) {
    const json = {};

    const email = snapshot.attr("email");
    const avatar_url = snapshot.attr("avatarUrl");
    const password = snapshot.attr("password");

    if (email) json.email = email;
    if (avatar_url) json.avatar_url = avatar_url;
    if (password) json.password = password;

    return json;
  }
}

function serializeUnderscoredProperties(element, fields) {
  fields.forEach(function (_type, field) {
    var payloadField = underscore(field);
    if (field === payloadField) {
      return;
    }

    element[field] = element[payloadField];
    delete element[payloadField];
  });

  return element;
}
