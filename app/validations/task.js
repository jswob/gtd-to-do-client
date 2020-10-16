import {
  validateLength,
  validatePresence,
} from "ember-changeset-validations/validators";

export default {
  content: [validatePresence(true), validateLength({ min: 1, max: 65 })],
};
