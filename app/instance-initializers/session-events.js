export function initialize(instance) {
  const applicationRoute = instance.__container__.lookup("route:application");
  const session = instance.__container__.lookup("service:session");

  session.on("authenticationSucceeded", function () {
    applicationRoute.transitionTo("user");
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
