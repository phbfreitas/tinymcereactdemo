const express = require('express');
const router = express.Router();

// @route   GET api/post
// @desc    Get a post
// @access  Public
router.get('/', (req, res) => res.send('Post route'));

// @route   POST api/posts
// @desc    Create a post
// @access  Public
router.post('/', async (req, res) => {
    try {
        const newPost = {
            title: req.body.title,
            description: req.body.description,
            blob: {
                data = fs.readFileSync(req.file.path),
                contentType: 'blob'
            }
        }

        const post = new Post(newPost);
        post.save();

        res.json({ message: 'New image added to the db!' });
    } catch (err) {
        err.status(500).send('Server Error');
    }
});


module.exports = router;