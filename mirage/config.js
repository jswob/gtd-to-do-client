import ENV from "gtd-to-do-client/config/environment";
import { Response } from "miragejs";

export default function () {
  this.urlPrefix = `${ENV.api.host}/${ENV.api.namespace}`;

  this.post("/users/sign_in", (schema, { requestBody }) => {
    let response;

    const userParams = getRequestParams(requestBody, ["username", "password"]);

    const users = schema.users.all();

    users.models.forEach(({ email, password, id }) => {
      if (email == userParams.username && password == userParams.password)
        response = {
          access_token: `access_token_${email}_${password}`,
          expires_in: 0.0001,
          refresh_token: `refresh_token_${email}_${password}`,
          token_type: "bearer",
          user_id: id,
        };
    });

    if (response) return response;

    return new Response(401, {}, { errors: { detail: "Could not find user" } });
  });

  this.post("/users", (schema, { requestBody }) => {
    const { user } = JSON.parse(requestBody);

    const users = schema.users.all().models;
    const isUnique = !users.filter(({ email }) => user.email == email).length;

    if (!isUnique) {
      return new Response(
        422,
        {},
        {
          errors: [
            {
              email: "has already been taken",
            },
          ],
        }
      );
    }

    const createdUser = schema.create("user", user);

    return {
      user: {
        id: createdUser.id,
        email: createdUser.email,
        password_hash: "correct_access_token",
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
