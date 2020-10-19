import {
  validateLength,
  validateFormat,
  validateConfirmation,
} from "ember-changeset-validations/validators";

export default {
  email: validateFormat({ type: "email" }),
  password: [validateLength({ min: 6, allowBlank: true })],
  repeatPassword: [validateConfirmation({ on: "password", allowBlank: true })],
  avatarUrl: [validateFormat({ type: "url", allowBlank: true })],
};
