import EmberRouter from "@ember/routing/router";
import config from "./config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route("sign-up");
  this.route("sign-in");
  this.route("user", { path: "user/:user_id" }, function () {
    this.route("collections", function () {
      this.route(
        "collection",
        { path: "collection/:collection_id" },
        function () {
          this.route('edit');
          this.route('delete');
        }
      );
      this.route('new');
    });
    this.route("profile");
    this.route("delete");

    this.route("buckets", function () {
      this.route("new");
    });

    this.route("bucket", { path: "bucket/:bucket_id" }, function () {
      this.route("edit");
      this.route("delete");
    });
  });
});
