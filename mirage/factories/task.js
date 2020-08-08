import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  content(i) {
    return `Just do it ${i}`;
  },

  isDone: false,
});
