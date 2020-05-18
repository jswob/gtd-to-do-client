"use strict";

module.exports = function (environment) {
  let ENV = {
    modulePrefix: "gtd-to-do-client",
    environment,
    rootURL: "/",
    locationType: "auto",
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    fastboot: {
      hostWhitelist: [/^localhost:\d+$/],
    },
  };

  if (environment === "development") {
    ENV.api = {
      host: "http://localhost:4000",
      namespace: "api",
    };

    ENV["ember-cli-mirage"] = {
      enabled: false,
    };
  }

  if (environment === "test") {
    ENV.api = {
      host: "http://localhost:4200",
      namespace: "api",
    };

    ENV["ember-cli-mirage"] = {
      enabled: true,
    };

    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  if (environment === "production") {
    // ENV.api = {
    //   host: "http://localhost:4000",
    //   namespace: "api",
    // };

    ENV["ember-cli-mirage"] = {
      enabled: true,
    };
  }

  return ENV;
};
