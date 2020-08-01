import Model, { attr, belongsTo, hasMany } from "@ember-data/model";

export default class ListModel extends Model {
  @attr("string") title;
  @attr("string") color;

  @belongsTo("collection") collection;
  @hasMany("task") tasks;
}
