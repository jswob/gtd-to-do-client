export default function (server) {
  // Create main user
  const owner = server.create("user", {
    email: "some@some.some",
    password: "some123",
  });

  // Create dummy users
  server.createList("user", 3);

  // Create dummy buckets
  server.createList("bucket", 3);

  // Create main bucket
  const bucket = server.create("bucket", {
    title: "some bucket",
    owner: owner,
  });

  // Create dummy collections
  server.createList("collection", 3);

  // Create main collection
  const collection = server.create("collection", {
    title: "Some collection",
    owner: owner,
    bucket: bucket,
  });

  // Create collctions without buckets
  server.createList("collection", 3, { owner: owner });

  // Create dummy lists
  server.createList("list", 3);

  // Create main list
  const list = server.create("list", {
    title: "Some list",
    owner: owner,
    collection: collection,
  });

  // Create dummy tasks
  server.createList("task", 3);

  // Create main task
  server.create("task", { content: "Some task", owner: owner, list: list });
}
