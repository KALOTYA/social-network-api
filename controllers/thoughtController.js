const Thought = require("../models/Thought");
const User = require("../models/User");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      });
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: "Thought created, but found no user with that ID",
        });
      }
      res.json("Created the Thought!!");
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  },
  async updateThought(req, res) {
    try {
      const updatethought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId }, 
        { $set: req.body }, 
        { new: true } 
      );
      res.json(updatethought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      const deletethought = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId } 
      );
      res.json(deletethought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async addReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!reaction) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!reaction) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};