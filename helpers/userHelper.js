require("dotenv").config();
const { knex } = require("../db/connection");


const createUser = async (payload) => {
  const [user] = await knex("rabbit").insert(payload);
  return user;
};

const getUsers = async () => {
  const users = await knex("rabbit")
  return users;
};

const updateUser = async (id, payload) => {
  await knex("rabbit").where({ id }).update(payload);
};

const deleteUser = async (id) => {
  await knex("rabbit").where({ id }).del();
};



module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
};
