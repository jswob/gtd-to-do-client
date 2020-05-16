export default function () {
  this.namespace = "api";

  this.get("/sign_in", (schema, request) => {
    console.log(request);
    return { data: {} };
  });
}
