const asyncHandler = require("express-async-handler");
const Page = require("../Modals/pageModel");
const User = require("../Modals/userModel");

const addPage = asyncHandler(async (req, res) => {
  try {
    const page = new Page(req.body);
    const result = await page.save();
    const user = await User.findByIdAndUpdate(
      req.body.UserId,
      { $push: { pages: result._id } },
      { new: true }
    );
    res.status(201).send(result);
  } catch (e) {
    res.status(400).send(e);
  }
});

const updatePage = asyncHandler(async (req, res) => {
  try {
    console.log(req.body.users);
    const pages = await Page.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        bg: req.body.bg,
        boards: req.body.boards,
        users: req.body.users,
        permission: req.body.permission,
      },
      { new: true }
    );
    res.status(201).send(pages);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

const deletePage = asyncHandler(async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    const user = await User.findByIdAndUpdate(
      req.body.UserId,
      { $pull: { pagess: req.params.id } },
      { new: true }
    );
    res.status(201).send(page);
  } catch (error) {
    res.status(400).send(error);
}
});

const getPage = asyncHandler(async (req, res) => {
  try {
    var result = await Page.findOne({ id: req.params.id }).populate({
      path: "boards",
      populate: { path: "cards" },
    });
    if(!result)
    var result = await Page.findById(req.params.id).populate({
      path: "boards",
      populate: { path: "cards" },
    });
    if(result && (result.permission == 'anyone' || result.users.indexOf(req.query._id) != -1 ))
    res.status(201).send(result);
    else 
    res.send("No data Found");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { addPage, updatePage, getPage, deletePage };
