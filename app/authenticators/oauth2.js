import OAuth2PasswordGrantAuthenticator from "ember-simple-auth/authenticators/oauth2-password-grant";
import ENV from "gtd-to-do-client/config/environment";

export default class Oauth2Authenticator extends OAuth2PasswordGrantAuthenticator {
  serverTokenEndpoint = `${ENV.api.host}/${ENV.api.namespace}/users/sign_in`;
}
