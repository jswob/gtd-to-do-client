import OAuth2PasswordGrantAuthenticator from "ember-simple-auth/authenticators/oauth2-password-grant";

export default class Oauth2Authenticator extends OAuth2PasswordGrantAuthenticator {
  serverTokenEndpoint = "/users/sign_in";
}
