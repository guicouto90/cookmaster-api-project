const connection = require('./connection');

const getAllUsers = async () => {
  const connect = await connection();
  const query = await connect.collection('users').find({}).toArray();

  return query;
};

const createUser = async (name, email, password, role) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('users')
    .insertOne({ name, email, password, role });

  return insertedId;
};

const findByEmail = async (email) => {
  const connect = await connection();
  const query = await connect.collection('users').findOne({ email });
  return query;
};

module.exports = {
  createUser,
  findByEmail,
  getAllUsers,
};