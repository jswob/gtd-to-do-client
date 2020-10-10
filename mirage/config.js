import ENV from "gtd-to-do-client/config/environment";
import { Response } from "miragejs";
export default function () {
  this.urlPrefix = `${ENV.api.host}/${ENV.api.namespace}`;

  this.post("/users/sign_in", (schema, { requestBody }) => {
    const userParams = getRequestParams(requestBody, ["username", "password"]);

    const user = schema.users.findBy({ email: userParams.username });

    if (user)
      return {
        access_token: `access_token_${user.id}`,
        expires_in: 0.0001,
        refresh_token: `refresh_token_${user.id}`,
        token_type: "bearer",
        user_id: user.id,
      };

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

  this.get("/users/:user_id", (schema, request) => {
    if (!checkToken(request))
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const user = schema.users.find(request.params.user_id);

    if (!user)
      return new Response(
        401,
        {},
        { errors: { detail: "Could not find user with this id" } }
      );

    return {
      users: user,
    };
  });

  this.get("/buckets", (schema, request) => {
    const userId = checkToken(request);

    if (!userId)
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const buckets = schema.buckets.all().models.filter(({ attrs }) => {
      if (attrs.ownerId == userId) return true;
      return false;
    });

    const response = buckets.map(({ attrs }) => {
      return {
        id: attrs.id,
        title: attrs.title,
        color: attrs.color,
        links: {
          collections: `/api/buckets/${attrs.id}/collections`,
        },
      };
    });

    return {
      buckets: response,
    };
  });

  this.get("/buckets/:bucket_id/collections", (schema, request) => {
    const userId = checkToken(request);

    if (!userId)
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const collections = schema.collections.all().models.filter(({ attrs }) => {
      if (attrs.ownerId == userId && attrs.bucketId == request.params.bucket_id)
        return true;
      return false;
    });

    const response = collections.map(({ attrs }) => {
      return {
        id: attrs.id,
        title: attrs.title,
        color: attrs.color,
        links: {
          collections: `/api/collections/${attrs.id}/lists`,
        },
      };
    });

    return {
      collections: response,
    };
  });

  this.post("/buckets", async (schema, request) => {
    const userId = checkToken(request);
    const owner = schema.users.find(userId);
    let collections = [];

    let requestBody = JSON.parse(request.requestBody).bucket;
    requestBody.collections.forEach((collection) => {
      let collectionRecord = schema.collections.find(collection.id);

      collections.push(collectionRecord);
    });

    requestBody.owner = owner;
    requestBody.collections = collections;

    const bucketAttrs = await schema.create("bucket", requestBody);

    const collectionsLink = `/api/buckets/${bucketAttrs.id}/collections`;

    let response = {
      id: bucketAttrs.id,
      title: bucketAttrs.title,
      color: bucketAttrs.color,
      owner: bucketAttrs.owner.id,
      links: {
        collections: collectionsLink,
      },
    };

    return { bucket: response };
  });

  this.put("/buckets/:id", async (schema, request) => {
    const userId = checkToken(request);
    const owner = schema.users.find(userId);

    let requestBody = JSON.parse(request.requestBody).bucket;

    const bucket = schema.buckets.find(request.params.id);

    const collections = requestBody.collections.map((collection) =>
      schema.collections.find(collection.id)
    );

    requestBody.owner = owner;
    requestBody.collections = collections;

    const updatedBucket = bucket.update(requestBody);

    const collectionsLink = `/api/buckets/${updatedBucket.id}/collections`;

    return {
      bucket: {
        id: updatedBucket.id,
        title: updatedBucket.title,
        color: updatedBucket.color,
        owner: updatedBucket.owner.id,
        links: {
          collections: collectionsLink,
        },
      },
    };
  });

  this.delete("/buckets/:id");

  this.get("/collections", (schema, request) => {
    const userId = checkToken(request);

    if (!userId)
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const collections = schema.collections.all().models.filter(({ attrs }) => {
      if (attrs.ownerId == userId && !attrs.bucketId) return true;
      return false;
    });

    const response = collections.map(({ attrs }) => {
      return {
        id: attrs.id,
        title: attrs.title,
        color: attrs.color,
        links: {
          collections: `/api/collections/${attrs.id}/lists`,
        },
      };
    });

    return {
      collections: response,
    };
  });

  // this.get("/collections/:collection_id");

  this.get("/collections/:collection_id", ({ collections }, request) => {
    if (!checkToken(request))
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const collection = collections.find(request.params.collection_id);

    return {
      collection: collection,
    };
  });

  this.get("/collections/:collection_id/lists", (schema, request) => {
    const userId = checkToken(request);

    if (!userId)
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const lists = schema.lists.all().models.filter(({ attrs }) => {
      if (
        attrs.ownerId == userId &&
        attrs.collectionId == request.params.collection_id
      )
        return true;
      return false;
    });

    const response = lists.map(({ attrs }) => {
      return {
        id: attrs.id,
        title: attrs.title,
        color: attrs.color,
        collection: attrs.collection.id,
        owner: attrs.owner.id,
        links: {
          tasks: `/api/lists/${attrs.id}/tasks`,
        },
      };
    });

    return {
      collections: response,
    };
  });

  this.post("/collections", async (schema, request) => {
    const userId = checkToken(request);
    const owner = schema.users.find(userId);

    let requestBody = JSON.parse(request.requestBody).collection;

    requestBody.owner = owner;

    let bucketId = requestBody.bucket;

    if (bucketId) requestBody.bucket = schema.buckets.find(bucketId);
    else requestBody.bucket = null;

    const collectionAttrs = await schema.create("collection", requestBody);

    const listsLink = `/api/collections/${collectionAttrs.id}/lists`;

    let response = {
      id: collectionAttrs.id,
      title: collectionAttrs.title,
      color: collectionAttrs.color,
      owner: collectionAttrs.owner.id,
      links: {
        collections: listsLink,
      },
    };

    return { collection: response };
  });

  this.delete("/collections/:collection_id", ({ collections }, request) => {
    if (!checkToken(request))
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const collection = collections.find(request.params.collection_id);
    collection.destroy();

    return {
      message: "Successfully deleted",
    };
  });
}

function getRequestParams(requestBody, keys) {
  let requestParams = {};

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

function checkToken(request) {
  const token = request.requestHeaders.authorization.split(" ")[1];

  if (!token || !token.includes("access_token_")) return false;

  return token.split("_token_")[1];
}
