import {
  validateLength,
  validateFormat,
  validateConfirmation,
  validatePresence,
} from "ember-changeset-validations/validators";

export default {
  title: [validatePresence(true), validateLength({ min: 1, max: 35 })],
};
