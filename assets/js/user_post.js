$(document).ready(function () {
  // Function to submit the form data using AJAX
  function createPost() {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = newPostDom(data.data.post);
          $("#post-list-container > ul").prepend(newPost);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  }

  // Function to create post in DOM
  function newPostDom(post) {
    let createdAt = new Date(post.createdAt);
    let date = createdAt.toLocaleDateString();
    let time = createdAt.toLocaleTimeString();

    return $(`
          <li id="post-${post._id}">
              <div class="detail">
                  <p>
                      <small>Posted by ${post.user.name}</small><br />
                      ${post.content}<br />
                      <small>Time:- ${time} Date:- ${date}</small>
                      <small><a class="delete-post-button" href="/posts/destroy/${post._id}">DELETE</a></small>
                  </p>
              </div>
              <br />
              <div class="post-comments">        
                  <form action="/comments/create" method="post">
                      <input type="text" name="content" placeholder="Type here to add comments.." required />
                      <input type="hidden" name="post" value="${post._id}" />
                      <input type="submit" value="Add comments" />
                  </form>       
              </div>
              <div class="post-comments-list">
                  <ul id="post-comments-${post._id}">          
                  </ul>
              </div>
              <br />
          </li>
      `);
  }

  // Attach event handlers to existing and future delete buttons using delegation
  $(document).on("click", ".delete-post-button", function (e) {
    e.preventDefault();

    var postLi = $(this).closest("li");
    var postId = postLi.attr("id").replace("post-", "");

    $.ajax({
      url: $(this).attr("href"),
      type: "get",
      success: function (response) {
        postLi.remove();
      },
      error: function () {
        alert("Error deleting the post.");
      },
    });
  });

  // Initialize the post creation form handler
  createPost();
});
