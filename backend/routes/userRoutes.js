const express = require("express");
const { registerUser, authUser, getUser, allUsers } = require("../controllers/userControllers");

const router = express.Router();
router.route("/").post(registerUser).get(allUsers);
router.get("/:email",getUser);
router.post("/login", authUser);

module.exports = router;

