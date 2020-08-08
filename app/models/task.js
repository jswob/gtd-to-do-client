import Model, { attr, belongsTo } from "@ember-data/model";

export default class TaskModel extends Model {
  @attr("string") content;
  @attr("boolean") isDone;

  @belongsTo("list") list;
  @belongsTo("user") owner;
}
