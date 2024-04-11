const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

// Controller function to render the home page
module.exports.home = async function (req, res) {
  try {
    // Fetch all posts and populate user and comments fields
    Post.find({})
      .sort('-createdAt')
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .exec()
      .then(async (posts) => {
        try {
          // Fetch all users
          const allUser = await User.find({});
          
          // Render the home page with posts and users
          return res.render("home", {
            title: "Home",
            posts: posts, // Pass the fetched posts to the view
            all_user: allUser, // Pass all users to the view
            add: "No Posts found.", // Message to display if no posts are found
          });
        } catch (err) {
          // Handle error in finding users
          console.error("Error in fetching users:", err);
        }
      })
      .catch((err) => {
        // Handle error in finding posts
        console.error("Error in fetching posts:", err);
      });
  } catch (err) {
    // Handle any other errors
    console.error("Error in fetching posts:", err);
    // Handle error appropriately, e.g., display an error message to the user
  }
};
