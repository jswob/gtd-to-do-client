import Route from "@ember/routing/route";
import { hash } from "rsvp";

export default class UserCollectionsCollectionIndexRoute extends Route {
  async model() {
    const collection = await this.modelFor("user.collections.collection");
    const lists = await collection.lists;

    return hash({
      collection: collection,
      lists: lists,
    });
  }
}
