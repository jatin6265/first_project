const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    const findPosts = await Post.find({});
    for (let i = 0; i < findPosts.length; i++) {
      const user = await User.findById(findPosts[i].user);
      const populatedPost = {
        ...findPosts[i], // Spread existing post properties
        user: user ? { name: user.name } : { name: "Unknown" },
      };
      findPosts[i] = populatedPost; 

      const timestampString =findPosts[i]._doc.createdAt.toString();
      const timestampParts = timestampString.split(" ");
      const date = timestampParts.slice(0, 4).join(" "); // Join the first 3 elements
      const time = timestampParts.slice(4, 5).join(":"); // Join elements from 3rd to 5th with colon separator
      findPosts[i].date=date;
      findPosts[i].time=time;

    }
    // console.log(findPosts);
    // Render the view with the populated posts array
    return res.render("home", {
      title: "Home",
      posts: findPosts,
      add: "No Posts found.",
    });
  } catch (error) {
    console.error("Error in fetching posts:", error);
    // Handle error appropriately, e.g., display an error message to the user
  }
};
