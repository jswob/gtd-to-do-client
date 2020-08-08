import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  title(i) {
    return `collection_title_${i}`;
  },

  color: "pink",
});
