db.getSiblingDB('admin').auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);
db.createUser({
  user: process.env.MONGODB_USER,
  pwd: process.env.MONGODB_PASSWORD,
  roles: ['readWrite'],
});
