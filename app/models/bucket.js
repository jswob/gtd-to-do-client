import Model, { attr, hasMany } from "@ember-data/model";

export default class BucketModel extends Model {
  @attr("string") title;
  @attr("string") color;

  @hasMany("collection") collections;
}
