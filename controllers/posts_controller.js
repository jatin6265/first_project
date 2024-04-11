const Post = require("../models/post");
const Comment = require("../models/comment");

// Controller function to create a new post
module.exports.create = async function (req, res) {
  try {
    // Create a new post with the provided content and user ID
    const newUser = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    // Redirect the user back
    return res.redirect("back");
  } catch (err) {
    // Handle errors if any
    console.error("Error in creating Post:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};

// Controller function to render user posts or a message if not logged in
module.exports.uploadPost = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      // If user is logged in, find their posts and render them
      Post.find({ user: req.user._id })
        .populate("user")
        .populate({
          path: "comments",
          populate: {
            path: "user",
          },
        })
        .exec()
        .then((mypost) => {
          return res.render("user_post", {
            title: "Create Post",
            mypost: mypost,
            add: "You haven't posted yet",
          });
        })
        .catch((err) => {
          console.error("Error in fetching posts:", err);
        });
    } else {
      // If user is not logged in, render a message prompting them to log in/sign up
      return res.render("user_post", {
        title: "Create Post",
        add: "Login to see your posts / Sign up to create a post",
      });
    }
  } catch (err) {
    // Handle errors if any
    console.error("Error in rendering user posts:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to delete a post
module.exports.destroy = async function (req, res) {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the current user is the owner of the post
    if (post.user.toString() === req.user.id.toString()) {
      // If user is the owner, delete the post and associated comments
      try {
        await Post.deleteOne({ _id: post.id }); // Using deleteOne method
        await Comment.deleteMany({ post: req.params.id });
        console.log("Post and comments deleted");

        // Redirect back
        return res.redirect("back");
      } catch (err) {
        // Handle errors if any
        console.error("Error deleting post and comments:", err);
        return res
          .status(500)
          .json({ error: "Error deleting post and comments" });
      }
    } else {
      // If user is not the owner, return forbidden
      console.log("Not eligible to delete post");
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }
  } catch (err) {
    // Handle errors if any
    console.error("Error in deleting Post:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
