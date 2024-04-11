{
  // method to submit the form data using Ajax
  console.log("hello");
  let createPost = function () {
    let newPostForm = $("#new-post-form");
    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        data: newPostForm.serialize(),
        success: function (data) {
            // console.log(data)
          let newPost=newPostDom(data.data.post)
          $('#post-list-container>ul').prepend(newPost);
          deletePost($(".delete-post-button",newPost));
        },
        error: function (error) {
          console. log (error.responseText);;
        },
      });
    });
  };

// method to create post in DOM
let newPostDom = function (post) {
  // Process createdAt to extract date and time
  let createdAt = new Date(post.createdAt);
  let date = createdAt.toLocaleDateString();
  let time = createdAt.toLocaleTimeString();

  // Construct the post element
  return $(`
  <li id="post-${post.id}"  >
      <div class="detail">
          <p>
              <small>Posted by ${post.user.name}</small><br />
              ${post.content}
              <br /><small>Time:- ${time} Date:- ${date}</small>
              <small><a class="delete-post-button" href="/posts/destroy/${post._id}">DELETE</a></small>
          </p>
      </div>
      <br />
      <div>
          <div class="post-comments">        
              <form action="/comments/create" method="post">
                  <input type="text" name="content" placeholder="Type here to add comments.." required />
                  <input type="hidden" name="post" value="${post._id}" />
                  <input type="submit" value="Add comments" />
              </form>       
          </div>
          <div class="post-comments-list">
              <ul id="post-comments-${post.id}">          
              </ul>
          </div>
      </div>
      <br />
  </li>
  `);
};

//  method to delete the post from the DOM

let deletePost=function (deleteLink){
  $(deleteLink).click(function(e) {
        e.preventDefault();

        $.ajax({
          type:'get',
          url:$(deleteLink).prop("href"),
          success:function (data) {
          $(`#post-${data.post_id}`).remove();
          },
          error: function(error) {
            console.log(error.response)
          }
        })
  })
}
  createPost();
}
