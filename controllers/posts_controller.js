const Post = require("../models/post");
const { post } = require("../routes");

module.exports.create = async function (req, res) {
  try {
    const newUser = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    return res.redirect("back");
  } catch (err) {
    console.error("Error in creating Post:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};

module.exports.uploadPost = async function (req, res) {
  try {
    // if(req.isAuthenticated()){
    // const myPost = await Post.find({user:req.user._id});
    // // console.log(myPost,"jatin ");
    //   return res.render('user_post',{
    //     title:"Create Post",
    //     mypost:myPost,
    // })}
    // return res.render('user_post',{
    //   title:"Create Post",
    //   add:"login to see your post / sign up to create post"
    // })

    if (req.isAuthenticated()) {
      Post.find({ user: req.user._id })
        .populate("user")
        .exec()
        .then((mypost) => {
          return res.render("user_post", {
            title: "Create Post",
            mypost: mypost,
          });
        })
        .catch((err) => {
          console.error("Error in fetching posts:", err);
        });
    } else {
      return res.render("user_post", {
        title: "Create Post",
        add: "login to see your post / sign up to create post",
      });
    }
  } catch (err) {
    console.error("Error in creating Post:", err);
    return res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
};
