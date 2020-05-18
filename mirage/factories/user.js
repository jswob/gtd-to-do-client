import { Factory } from "ember-cli-mirage";

export default Factory.extend({
  email(i) {
    return `User-${i}`;
  },

  password(i) {
    return `some-12${i}`;
  },
});
