module.exports.home = function (req, res) {
  console.log(req.cookies);
  res.cookie('jatin',567
  )
  return res.render("home", {
    title: "home",
  });
};
