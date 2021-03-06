"use strict";

module.exports = function(/* environment, appConfig */) {
  // See https://zonkyio.github.io/ember-web-app for a list of
  // supported properties

  return {
    name: "gtd-to-do-client",
    short_name: "GTD-TD",
    description: "",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/ember-welcome-page/images/construction.png",
        sizes: "540x540",
        type: "image/png"
      }
    ],
    ms: {
      tileColor: "#fff"
    }
  };
};
