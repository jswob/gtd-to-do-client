import { EmbeddedRecordsMixin } from "@ember-data/serializer/rest";
import RESTSerializer from "@ember-data/serializer/rest";

export default class BucketSerializer extends RESTSerializer.extend(
  EmbeddedRecordsMixin
) {
  attrs = {
    collections: { embedded: "always" },
  };
}
