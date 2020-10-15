import RESTSerializer from "@ember-data/serializer/rest";
import { underscore } from "@ember/string";
import { get } from "@ember/object";

export default class TaskSerializer extends RESTSerializer {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    var fields = get(primaryModelClass, "fields");

    if (payload.tasks) {
      payload.tasks.forEach((task) =>
        serializeUnderscoredProperties(task, fields)
      );
    } else {
      serializeUnderscoredProperties(payload.task, fields);
    }

    return super.normalizeResponse(...arguments);
  }

  serialize(snapshot, _options) {
    let json = {
      content: snapshot.attr("content"),
      is_done: snapshot.attr("isDone"),
      list: snapshot.belongsTo("list", { id: true }),
    };

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
