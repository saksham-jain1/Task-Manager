const express = require("express");
const { getPage, addPage, updatePage, deletePage } = require("../controllers/pageControllers");
const { route } = require("./userRoutes");

const router = express.Router();
router.route("/").post(addPage);
router.get("/:id", getPage);
router.patch("/:id", updatePage);
router.delete("/:id", deletePage);

module.exports = router;
