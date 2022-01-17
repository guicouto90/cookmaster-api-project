const connection = require('./connection');

const findUser = async (email) => {
  console.log(email);
  const connect = await connection();
  const query = await connect.collection('users').findOne({ email });

  return query;
};

module.exports = {
  findUser,
};