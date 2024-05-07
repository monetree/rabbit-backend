const express = require("express");
const router = express.Router();
const {
  userCreate,
  userUpdate,
  userDelete,
  fetchUsers
} = require("../controllers/userController");


router.route("/users").get(function (req, res) {
  const result = fetchUsers(req, res);
  return result;
});

router.route("/create-user").post(function (req, res) {
  const result = userCreate(req, res);
  return result;
});

router.route("/delete-user/:id").delete(function (req, res) {
  const result = userDelete(req, res);
  return result;
});

router.route("/update-user").patch(function (req, res) {
  const result = userUpdate(req, res);
  return result;
});


module.exports = router;
