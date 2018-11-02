const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Validation

const validatePostInput = require('../../validation/posts');


//@route GET api/posts/test
//@desc  posts  route
//@access Public
router.get('/test', (req, res) => res.json({
    msg: 'posts Works'
}));


//@route Get api/posts/
//@desc  Get Posts route
//@access public
router.get('/', (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => res.json(posts)).catch(err => res.status(404))
        .catch(err => res.status(404).json({
            nopostfound: 'Not posts found with that id'
        }));;
})

//@route Get api/posts/:id
//@desc  Get Posts route
//@access public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostfound: 'Not post found with that id'
        }));
})


//@route POST api/posts/
//@desc  Create  route
//@access Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));

})



//@route Delete api/posts/:id
//@desc  Delete Post route
//@access Private
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check for the post
                    if (post.user.toString() !== req.user.id) {
                        res.status(401).json({
                            notAutorized: 'user not Authorized'
                        });
                    }

                    //Delete
                    post.remove().then(() => res.json({
                        sucess: true
                    })).catch(err => res.status(404).json({
                        postnotfound: 'Post not found'
                    }));
                })
        })
});

//@route Post api/posts/like/:id
//@desc  Post Post route
//@access Private
router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filetr(like => like.user.toString() === req.user.id).length > 0) {
                        res.status(400).json({
                            alreadyLiked: 'user Already this Post'
                        })
                    }

                    //Add like array
                    post.likes.unshift({
                        user: req.user.id
                    });
                    post.save().then(post => res.json(post));

                })
                .catch(err => res.status(404).json({
                    postnotfound: 'Post not found'
                }));
        });
});


//@route Delete api/posts/unlike/:id
//@desc  Delete Post route
//@access Private
router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filetr(like => like.user.toString() === req.user.id).length === 0) {
                        res.status(400).json({
                            alreadyLiked: 'you have not liked this post'
                        })
                    }

                    //Get Remove index
                    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                    // Splice out of array
                    post.like.splice(removeIndex);

                    //Save
                    post.save().then(post => res.json(post));

                })
                .catch(err => res.status(404).json({
                    postnotfound: 'Post not found'
                }));
        });
});


//@route Post api/posts/unlike/:id
//@desc  post comment route
//@access Private

router.post('/comment/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //Add comment
            post.comments.unshift(newComment);

            //save
            post.save().then(post => res.json(post))
        })
        .catch(err => releaseEvents.status(404).json({
            postnotfound: 'No post found'
        }))
});


//@route Delete api/posts/unlike/:id
//@desc  Delete comment from post
//@access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            //check
            if(post.comments.filetr(comment => comment._id.toString()=== req.params.comment_id).length === 0){
                return res.status(404).json({commentnotexits:"Comment doesn't exist"});
            }

            //Get remove index
            const removeIndex = post.comments
            .maps(item => item._id.toString())
            .indexOf(req.params.comment_id);
        
            //Spice comment out of array
            post.comment.splice(removeIndex,1);

            post.save().then(post=>res.json(post));
        })

        .catch(err => releaseEvents.status(404).json({
            postnotfound: 'No Comment found'
        }))
});

module.exports = router;