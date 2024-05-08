const User = require("../models/User");
const Thought = require("../models/Thought");
const { ObjectId } = require("mongodb");

module.exports = {
  //Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user by ID
  async getSingleUser(req, res) {
    try {
      const objId = new ObjectId(req.params.userId);
      const singleUser = await User.findOne({ _id: objId });
      res.json(singleUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a user
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
 // Create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const objId = new ObjectId(req.params.userId);
      // Find and delete the user by ID
      const deleteuser = await User.findOneAndDelete({ _id: objId });
      // Delete all thoughts associated with the deleted user
      
      await Thought.deleteMany({ _id: { $in: deleteuser.thoughts } });
      res.json(deleteuser);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Add a friend to user's friend list
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
       // Find user by ID and add friend to friends array
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
  // Remove a friend from user's friend list
  async removeFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;
       // Find user by friend ID and remove friend from friends array
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