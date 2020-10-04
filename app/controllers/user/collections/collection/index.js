import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class UserCollectionsCollectionIndexController extends Controller {
  queryParams = ["selectedList"];

  @tracked
  selectedList = null;
}
