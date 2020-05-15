import Controller from "@ember/controller";
import LoginValidation from "../validations/login";

export default class SignInController extends Controller {
  LoginValidation = LoginValidation;
}
