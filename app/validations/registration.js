import {
  validateLength,
  validateFormat,
  validateConfirmation,
  validatePresence,
} from "ember-changeset-validations/validators";

export default {
  email: validateFormat({
    type: "email",
  }),
  password: [validatePresence(true), validateLength({ min: 6 })],
  repeatPassword: [
    validatePresence(true),
    validateConfirmation({ on: "password" }),
  ],
};
