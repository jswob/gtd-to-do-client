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

  this.get("/buckets/:bucket_id", ({ buckets }, request) => {
    if (!checkToken(request))
      return new Response(401, {}, { errors: { detail: "Bad token" } });

    const bucket = buckets.find(request.params.bucket_id);

    return {
      bucket: bucket,
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
          lists: `/api/collections/${attrs.id}/lists`,
        },
      };
    });

    return {
      collections: response,
    };
  });

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
        collection: attrs.collectionId,
        owner: attrs.ownerId,
        links: {
          tasks: `/api/lists/${attrs.id}/tasks`,
        },
      };
    });

    return {
      lists: response,
    };
  });

  this.put("/collections/:collection_id", (schema, request) => {
    // Get owner model
    const userId = checkToken(request);
    const owner = schema.users.find(userId);
    // Get request params in object form
    let requestBody = JSON.parse(request.requestBody).collection;

    const collection = schema.collections.find(request.params.collection_id);

    let lists = null;
    if (requestBody.lists)
      lists = requestBody.lists.map((list) => schema.lists.find(list.id));

    if (requestBody.bucket)
      requestBody.bucket = schema.buckets.find(requestBody.bucket);
    else requestBody.bucket = null;

    requestBody.owner = owner;
    requestBody.collections = lists;

    const updatedCollection = collection.update(requestBody);

    const listsLink = `/api/collections/${updatedCollection.id}/lists`;

    return {
      collection: {
        id: updatedCollection.id,
        title: updatedCollection.title,
        color: updatedCollection.color,
        owner: updatedCollection.ownerId,
        bucket: updatedCollection.bucketId,
        links: {
          lists: listsLink,
        },
      },
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

  this.get("/lists/:list_id", (schema, request) => {
    console.log("y");
    const list = schema.lists.find(request.params.list_id);

    const tasksLink = `/api/lists/${list.id}/tasks`;

    let response = {
      id: list.id,
      title: list.title,
      color: list.color,
      owner: list.ownerId,
      colleciton: list.collectionId,
      links: {
        tasks: tasksLink,
      },
    };

    return { list: response };
  });

  this.get("lists/:list_id/tasks", (schema, request) => {
    const tasks = schema.tasks.all().models.filter(({ attrs }) => {
      if (attrs.listId == request.params.list_id) return true;
      return false;
    });

    const response = tasks.map(({ attrs }) => {
      return {
        id: attrs.id,
        title: attrs.title,
        color: attrs.color,
        list: attrs.listId,
        owner: attrs.ownerId,
        links: {
          tasks: `/api/lists/${attrs.id}/tasks`,
        },
      };
    });

    return {
      tasks: response,
    };
  });

  this.post("/lists", async (schema, request) => {
    const userId = checkToken(request);
    const owner = schema.users.find(userId);

    let requestBody = JSON.parse(request.requestBody).list;

    requestBody.owner = owner;

    let collectionId = requestBody.collection;

    if (collectionId)
      requestBody.collection = schema.collections.find(collectionId);
    else requestBody.collection = null;

    const listAttrs = await schema.create("list", requestBody);

    const tasksLink = `/api/lists/${listAttrs.id}/tasks`;

    let response = {
      id: listAttrs.id,
      title: listAttrs.title,
      color: listAttrs.color,
      owner: listAttrs.owner.id,
      collection: listAttrs.collectionId,
      links: {
        tasks: tasksLink,
      },
    };

    return { list: response };
  });

  this.put("/lists/:list_id", (schema, request) => {
    // Get owner model
    const userId = checkToken(request);
    const owner = schema.users.find(userId);
    // Get request params in object form
    let requestBody = JSON.parse(request.requestBody).list;

    const list = schema.lists.find(request.params.list_id);

    let tasks = null;
    if (requestBody.tasks)
      tasks = requestBody.tasks.map((list) => schema.tasks.find(list.id));

    if (requestBody.collection)
      requestBody.collection = schema.collections.find(requestBody.collection);
    else requestBody.collection = null;

    requestBody.owner = owner;
    requestBody.tasks = tasks;

    const updatedList = list.update(requestBody);

    const tasksLink = `/api/lists/${updatedList.id}/tasks`;

    const response = {
      id: updatedList.id,
      title: updatedList.title,
      color: updatedList.color,
      owner: updatedList.ownerId,
      collection: updatedList.collectionId,
      links: {
        tasks: tasksLink,
      },
    };

    return {
      list: response,
    };
  });

  this.delete("/lists/:id");

  this.post("/tasks", async (schema, request) => {
    let requestBody = JSON.parse(request.requestBody).task;

    if (!requestBody.list) var userId = checkToken(request);
    else var userId = requestBody.owner;

    const owner = schema.users.find(userId);

    requestBody.owner = owner;

    let listId = requestBody.list;

    if (listId) requestBody.list = schema.lists.find(listId);
    else requestBody.list = null;

    const taskAttrs = await schema.create("task", requestBody);

    let response = {
      id: taskAttrs.id,
      content: taskAttrs.content,
      is_done: taskAttrs.is_done,
      owner: taskAttrs.owner.id,
      list: taskAttrs.listId,
    };

    return { task: response };
  });

  this.get("/tasks/:task_id", (schema, request) => {
    const task = schema.tasks.find(request.params.task_id);

    let response = {
      id: task.id,
      content: task.content,
      is_done: task.is_done,
      owner: task.ownerId,
      list: task.listId,
    };

    return { task: response };
  });

  this.put("/tasks/:task_id", (schema, request) => {
    let requestBody = JSON.parse(request.requestBody).task;

    if (!requestBody.list) var userId = checkToken(request);
    else var userId = requestBody.owner;

    const owner = schema.users.find(userId);

    const task = schema.tasks.find(request.params.task_id);

    let listId = requestBody.list;

    if (listId) requestBody.list = schema.lists.find(listId);
    else requestBody.list = null;

    requestBody.owner = owner;

    const updatedTask = task.update(requestBody);

    let response = {
      id: updatedTask.id,
      content: updatedTask.content,
      is_done: updatedTask.is_done,
      owner: updatedTask.owner.id,
      list: updatedTask.listId,
    };

    return { task: response };
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
