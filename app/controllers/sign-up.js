import Controller from "@ember/controller";
import RegistrationValidations from "../validations/registration";

export default class SignUpController extends Controller {
  RegistrationValidations = RegistrationValidations;
}
