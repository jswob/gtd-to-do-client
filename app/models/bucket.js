import Model, { attr, hasMany, belongsTo } from "@ember-data/model";

export default class BucketModel extends Model {
  @attr("string") title;
  @attr("string") color;

  @belongsTo("user") owner;
  @hasMany("collection") collections;
}
