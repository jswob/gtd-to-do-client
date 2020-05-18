import ENV from "gtd-to-do-client/config/environment";

export default function () {
  this.urlPrefix = `${ENV.api.host}/${ENV.api.namespace}`;

  this.post("/users/sign_in", (schema, { requestBody }) => {
    let response;
    const userParams = getRequestParams(requestBody, ["username", "password"]);

    const users = schema.users.all();

    users.models.forEach(({ email, password }) => {
      if (email == userParams.username && password == userParams.password)
        response = {
          access_token: `access_token_${email}_${password}`,
          expires_in: 1,
          refresh_token: `refresh_token_${email}_${password}`,
          token_type: "bearer",
        };
    });

    if (response) return response;

    return {
      errors: {
        detail: "Could not find user",
      },
    };
  });
}

function getRequestParams(requestBody, keys) {
  const requestParams = {};

  requestBody.split("&").forEach((param) => {
    param = param.split("=");
    for (let i = 0; i < keys.length; i++) {
      if (param[0].includes(keys[i])) {
        requestParams[param[0]] = param[1].replace("%40", "@");
      }
    }
  });

  return requestParams;
}
