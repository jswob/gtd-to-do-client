import Model, { attr, hasMany, belongsTo } from "@ember-data/model";

export default class CollectionModel extends Model {
  @attr("string") title;
  @attr("string") color;

  @belongsTo("bucket") bucket;
  @belongsTo("user") owner;
  @hasMany("list") lists;
}
