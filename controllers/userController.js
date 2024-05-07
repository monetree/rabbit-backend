require("dotenv").config();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,

} = require("../helpers/userHelper");
const { handleErrorResponse } = require("../utils/configs");


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "admin@soubhagya.com" && password === "admin") {
      res.send({ msg: "User logged in successfully" });
    } else {
      return handleErrorResponse(res, "Invalid credentials");
    }
  } catch (error) {
    return handleErrorResponse(res, error.message);
  }
};


const userCreate = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await createUser({name, email, phone});
    res.send({ msg: "User created successfully" });
  } catch (error) {
    console.log(error)
    return handleErrorResponse(res, error.message);
  }
};

const userUpdate = async (req, res) => {
  try {
    const { id, name, email, phone, is_active, avatar } = req.body;
    await updateUser(id, {name, email, phone, is_active, avatar});
    res.send({ msg: "User updated successfully" });
  } catch (error) {
    console.log(error)
    return handleErrorResponse(res, error.message);
  }
};

const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.send({ msg: "User deleted successfully" });
  } catch (error) {
    return handleErrorResponse(res, error.message);
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (error) {
    return handleErrorResponse(res, error.message);
  }
}
module.exports = {
  userCreate,
  userUpdate,
  userDelete,
  fetchUsers,
  userLogin
};
