import { Factory, association } from "ember-cli-mirage";

export default Factory.extend({
  title(i) {
    return `bucket_title_${i}`;
  },

  color: "red",
});
