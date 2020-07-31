export function initialize(instance) {
  const applicationRoute = instance.__container__.lookup("route:application");
  const session = instance.__container__.lookup("service:session");

  session.on("authenticationSucceeded", function () {
    const user_id = session.data.authenticated.user_id;
    applicationRoute.transitionTo("user", user_id);
  });

  session.on("invalidationSucceeded", function () {
    applicationRoute.transitionTo("sign-in");
  });
}

export default {
  initialize,
  name: "session-events",
  after: "ember-simple-auth",
};
