const Comment = require("../models/comment");
const Post = require("../models/post");

// Controller function to create a comment
module.exports.create = async function (req, res) {
  try {
    // Find the post by ID
    const post = await Post.findById(req.body.post);
    if (post) {
      try {
        // Create a new comment
        const comment = await Comment.create({
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        });
        // Add the comment to the post's comments array
        post.comments.push(comment);
        // Save the updated post
        post.save();
        // Redirect back to the page
        return res.redirect("back");
      } catch(err) {
        // Handle any errors in creating the comment
        console.error("Error in creating Comment:", err);
        return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
      }
    }
  } catch(err) {
    // Handle any errors in fetching the post
    console.error("Error in fetching post to which the comment is dope:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};

// Controller function to delete a comment
module.exports.destroy = async function (req, res) {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the current user is the owner of the comment
    if (comment.user.toString() === req.user.id.toString()) {
      // Remove the comment
      try {
        // Delete the comment
        await Comment.deleteOne({ _id: comment.id }); // Using deleteOne method
        // Remove the comment ID from the post's comments array
        await Post.findByIdAndUpdate(comment.post, { $pull: { comments: req.params.id }});
        // Redirect back to the page
        return res.redirect("back");
      } catch (err) {
        // Handle any errors in deleting the comment
        console.log("Error deleting comments:", err);
        return res.status(500).json({ error: "Error deleting comments" });
      }
    } else {
      // If the current user is not the owner of the comment, return forbidden
      console.log("Not eligible to delete comment");
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }
  } catch (err) {
    // Handle any other errors
    console.error("Error in deleting comment:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
