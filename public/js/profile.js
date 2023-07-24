const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');
const postie = document.querySelector('.header_text');
const uploadBtn = document.querySelector('.profile-pic');
const uploadForm = document.querySelector('.pictureUpload');

var blackBlock = document.querySelector(".black-hover");
var modal = document.getElementById("editProfileModal");
var btn = document.getElementById("editProfile");
var span = document.getElementsByClassName("close")[0];
var saveBtn = document.getElementById("saveChanges");

var isMouseDownInModal = false;

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
    
}); 

postie.addEventListener('click', e => {
  e.preventDefault();
  window.location.href = "/loggedIn";
});

/*
uploadBtn.addEventListener('mouseover', e => {
  blackBlock.style.display = "block";
  document.getElementById('#profilePic').style.visibility = "hidden";

});

uploadBtn.addEventListener('mouseout', e => {
  blackBlock.style.display = "none";
  document.getElementById('#profilePic').style.display = "visible";
});*/

uploadBtn.addEventListener('click', e => {
  uploadForm.classList.toggle('hidden');
});

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

modal.addEventListener('mousedown', function(event) {
    isMouseDownInModal = event.target == modal;
});

window.addEventListener('mouseup', function(event) {
    if (isMouseDownInModal && event.target == modal) {
        modal.style.display = "none";
    }
    isMouseDownInModal = false;
});

const searchPostBtn = document.querySelector("#searchsubmit");

searchPostBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const searchText = document.querySelector("#searchbar").value;

    console.log("index.js data", searchText);
    const jString = JSON.stringify({searchText});

    const response = await fetch("/searchquery", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    });
    window.location.href= "/searchl";
    if(response.status == 200){
        console.log("Search Success")
    }
})

const logoBtn = document.querySelector(".logo");

logoBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    window.location.href = "/loggedIn";
})

const editPost = document.querySelectorAll('.edit-post-button');
const editpostForm = document.querySelector('#editpostform'); 
const submitPost = document.querySelector('#submit-post');

const title = document.querySelector('#titlepost');
const body = document.querySelector('#postbody');

let canSubmit = 0;

function checkInputs() {
    if(title.value.trim() !== '' && body.value.trim() !== ''){
        submitPost.disabled = false;
        submitPost.value = "Submit";
        submitPost.style.color = "black";
    }else{
        submitPost.disabled = true;
        submitPost.value = "Fill out all inputs!";
        submitPost.style.color = "red";
    }
}

title.addEventListener('input', checkInputs);
body.addEventListener('input', checkInputs);

editPost.forEach(button =>{
  button.addEventListener('click', (a) => {
      editpostForm.classList.add('show');
      submitPost.disabled = true;
      submitPost.value = "Fill out all inputs!";
      submitPost.style.color = "red";

      const exitpostform = document.querySelector('.exit');

      exitpostform.addEventListener('click', (e) => {
          e.preventDefault();
          editpostForm.classList.remove('show');
      })

      const postInstance = a.target.closest('.post-instance');
      const postID = postInstance.getAttribute('data-ID');
      console.log("POST INDEX", postID);

      submitPost.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = document.querySelector('#titlepost').value;
        const body = document.querySelector('#postbody').value;
        const sendPostID = parseInt(postID);

        console.log({title, body, sendPostID});
        const jString = JSON.stringify({title, body, sendPostID});

        const response = await fetch("/editPost", {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        });

        editpostForm.classList.remove('show');

        if(response.status == 200){
          console.log("Edit post success");
          const postID = await response.text()
          window.location.href = "/postPage/"+postID;
        }else
          console.error(`An error has occured. Status code = ${response.status}`);          
      })
  })       
})

/*Opens the editor*/
var editButton = document.querySelectorAll('.edit-button');

for (let x = 0; x < editButton.length; x++) {
    editButton[x].addEventListener("click", (e) => {
      let commentInstance = e.target.closest('.comment-bar');
      commentInstance.querySelector("#comment-body").style.display = "none";
      commentInstance.querySelector("#edit-comment-body").value = document.getElementById("comment-body").textContent;
      commentInstance.querySelector("#edit-comment-body").style.display = "inline-block";
      commentInstance.querySelector(".save-button").style.display = "inline-block";

      editButton[x].style.display = "none";
      
      let save = commentInstance.querySelector('.save-button');

      save.addEventListener('click', async() => {

          const postID = commentInstance.getAttribute('data-postID');
          const commentID = commentInstance.getAttribute('data-commentID');
          const commentBody = commentInstance.querySelector("#edit-comment-body").value;

          console.log({postID,commentID,commentBody});
          const jString = JSON.stringify({postID,commentID,commentBody});

          const response = await fetch("/editComment", {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
          });

          //editpostForm.classList.remove('show');

          if(response.status == 200){
            console.log("Edit post success");
            const postID = await response.text()
            window.location.href = "/postPage/"+postID;
          }else
            console.error(`An error has occured. Status code = ${response.status}`); 
   
      });
  });
}


saveBtn.onclick = async function() {
    var newUsername = document.getElementById("newUsername").value;
    var newBio = document.getElementById("newBio").value;
    var newBday = document.getElementById("newBday").value;
  // Here you would typically send the new data to the server and get a response

  const get = await fetch("/getCurrentUser", {
    method: "GET"
  });

  let currentUser;

  if(get.status == 200){
    currentUser = await get.text();
  }else{
    console.error(`An error has occured. Status code = ${response.status}`); 
  }


    console.log({newUsername, newBio, newBday, currentUser});
    const jString = JSON.stringify({newUsername, newBio, newBday, currentUser});
    
    const response = await fetch("/editProfile", {
      method: "POST",
      body: jString,
      headers: {
          "Content-Type": "application/json"
      }
    });

    if(response.status == 200){
      console.log("Edit profile success");
      window.location.reload();
    }else
      console.error(`An error has occured. Status code = ${response.status}`); 

}

const savePic = document.querySelector('#savePic');

savePic.addEventListener('click', async (e) => {
  e.preventDefault();

  const imageInput = document.querySelector('#newProfilePic');
  const image = imageInput.files[0];

  console.log(image);

  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch("/editPicture", {
    method: "POST",
    body: formData
  })

  if(response.status == 200){
    console.log("Edit picture success");
    window.location.reload();
  }else
    console.error(`An error has occured. Status code = ${response.status}`); 

})

const deletePost = document.querySelectorAll('.delete-post-button');

for (let x = 0; x < deletePost.length; x++) {
    deletePost[x].addEventListener("click", async (e) => {
      const postInstance = e.target.closest('.post-instance');
      const index = postInstance.getAttribute('data-ID');

      const jString = JSON.stringify({index});

      const response = await fetch("/deletePost", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
      });
  
      if(response.status == 200){
        console.log("Delete Post Success");
        window.location.reload();
      }else
        console.error(`An error has occured. Status code = ${response.status}`); 
  });
}

const deleteComment = document.querySelectorAll('.delete-comment-button');

for (let x = 0; x < deleteComment.length; x++) {
    deleteComment[x].addEventListener("click", async (e) => {
      const commentInstance = e.target.closest('.comment-bar');
      const commentID = commentInstance.getAttribute('data-commentID');
      const postID = commentInstance.getAttribute('data-postID');

      console.log(commentID, postID);

      const jString = JSON.stringify({commentID,postID});

      const response = await fetch("/deleteComment", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
      });
  
      if(response.status == 200){
        console.log("Delete Post Success");
        window.location.reload();
      }else
        console.error(`An error has occured. Status code = ${response.status}`); 
  });
}

const logout = document.querySelector('.dropdown-content ul li:nth-child(3)');

logout.addEventListener('click', async (e) => {
    e.preventDefault();

    const response = await fetch("/logout", {
        method: "GET"
    });

    if(response.status == 200){
        console.log("Logout successful");
        window.location.href = "/";
    }
    else
        console.log("Logout failed");
})

const viewPosts = document.querySelector('#morePosts');

viewPosts.addEventListener('click', async (e) => {
    const index = viewPosts.dataset.index;
    console.log(index);
    window.location.href = '/profilePosts/'+index;
    
})

const viewComments = document.querySelector('#moreComments');

viewComments.addEventListener('click', async (e) => {
    const index = viewPosts.dataset.index;
    console.log(index);
    window.location.href = '/profileComments/'+index;   
})

const pictureHolder = document.querySelector('#newProfilePic');

pictureHolder.addEventListener('change', (e) => {
    const uploadButton = document.querySelector('#uploadButton');

    uploadButton.style.backgroundColor = '#3bc98e';

});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('post-button')) {
      e.preventDefault();

      postIntance = e.target.closest('.post-instance');
      const index = postIntance.getAttribute('data-ID');
      console.log("POST INDEX", index);

      window.location.href = "/postPage/"+index;

  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('comment-body')) {
      e.preventDefault();

      commentIntance = e.target.closest('.comment-bar');
      const index = commentIntance.getAttribute('data-postID');
      console.log("POST INDEX", index);

      window.location.href = "/postPage/"+index;

  }
});










