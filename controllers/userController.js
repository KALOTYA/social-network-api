const User = require("../models/User");
const Thought = require("../models/Thought");
const { ObjectId } = require("mongodb");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const objId = new ObjectId(req.params.userId);
      const singleUser = await User.findOne({ _id: objId });
      res.json(singleUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const updateuser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body }, 
        { new: true } 
      );
      console.log("id" + req.params.userId);
      res.json(updateuser);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },
 
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const objId = new ObjectId(req.params.userId);

      const deleteuser = await User.findOneAndDelete({ _id: objId });
      
      await Thought.deleteMany({ _id: { $in: deleteuser.thoughts } });
      res.json(deleteuser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
      const addfriend = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } },
        { new: true }
      );
      res.json(addfriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
      const removefriend = await User.findOneAndUpdate(
        { friends: friendId },
        { $pull: { friends: friendId } },
        { new: true }
      );

      res.json(removefriend);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};