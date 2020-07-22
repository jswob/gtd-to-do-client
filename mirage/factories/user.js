import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  email(i) {
    return `user${i}@email.com`;
  },

  password(i) {
    return `some-12${i}`;
  },
});
