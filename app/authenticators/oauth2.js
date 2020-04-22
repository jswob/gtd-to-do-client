import OAuth2PasswordGrantAuthenticator from "ember-simple-auth/authenticators/oauth2-password-grant";

export default class Oauth2Authenticator extends OAuth2PasswordGrantAuthenticator {
  serverTokenEndpoint = "http://localhost:4000/api/users/sign_in";
}
