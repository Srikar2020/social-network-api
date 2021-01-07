const {User, Thought} = require('../models');

const ThoughtController = {
    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => res.status(400).json(err))
    },
    getThoughtById(req, res) {
        Thought.findById({_id: req.params.id})
            .select('-__v')
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    res.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then(dbThoughtData => {
                return User.findOneAndUpdate({username: dbThoughtData.username}, {$push: {thoughts: dbThoughtData._id}}, {new:true});
            })
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({message: "No user found with this id!"});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err))
    },
    updateThought(req, res) {
        Thought.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
            .then(dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteThought(req, res) {
        Thought.findByIdAndDelete({_id: req.params.id})
            .then(dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    createReaction(req, res) {
        console.log(req.body);
        Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$push: {reactions: req.body}}, {new: true, runValidators: true})
            .then(dbThoughtData => {
                if(!dbThoughtData){
                    req.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId}, {$pull: {reactions: {reactionId: req.body.reactionId}}}, {new: true})
            .then(dbThoughtData => {
                if(!dbThoughtData) {
                    req.status(404).json({message: "No thought found with this id!"});
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    }
};

module.exports = ThoughtController;
