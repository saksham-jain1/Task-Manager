const asyncHandler = require("express-async-handler");
const Page = require("../Modals/pageModel");
const User = require("../Modals/userModel");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const page = new Page(req.body.pages);
    const pageResult = await page.save();
    const user = new User({...req.body,pages:[pageResult._id]});
    const result = await user.save();
    
    res.status(201).send({...result,pages:[pageResult]});
  } catch (e) {
    res.status(400).send(e);
  }
});

const authUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user && user.password==req.body.password)
    {
      const data = await User.findOne({ email: req.body.email }).populate({
        path: "pages",
        populate: [{ path: "users", select:"email name _id" },{ path: "boards", populate: { path: "cards" } }],
      });
      res.status(200).send(data);
    }
    else
    res.status(400).send("Invalid Credentials");
  } catch (error) {
    res.status(400).send(error.message);
    throw new Error(error.message);
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.params.email },
      { password: 0 }
    );

    res.json(user);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword, { password: 0,pages: 0 })
  // .find({
  //   _id: { $ne: req.user._id },
  // });
  res.send(users);
});

module.exports = { registerUser, authUser, getUser, allUsers };
