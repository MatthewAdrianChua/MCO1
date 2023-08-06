const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');
const postie = document.querySelector('.header_text');

const editPost = document.querySelectorAll('.edit-post-button');
const editpostForm = document.querySelector('#editpostform'); 

const clickprofile = document.querySelector('.dropdown-content a:first-child');

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

postie.addEventListener('click', e => {
  e.preventDefault();
  window.location.href = "/loggedIn";
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

let currentUser = "";
async function getCurrentUser(){
    const response = await fetch("/getCurrentUser", {
        method: "GET"
        })
    
        if(response.status == 200){
            currentUser = await response.text();
        }else{
            console.error(`An error has occured. Status code = ${response.status}`); 
        }
}

getCurrentUser();
  
clickprofile.addEventListener('click', async (e) =>{
    e.preventDefault();
  
    window.location.href = "/profile/"+currentUser;
})

var editButton = document.querySelectorAll('.edit-button');

for (let x = 0; x < editButton.length; x++) {
    editButton[x].addEventListener("click", (e) => {
      let commentInstance = e.target.closest('.comment-bar');
      commentInstance.querySelector("#comment-body").style.display = "none";
      commentInstance.querySelector("#edit-comment-body").value = commentInstance.querySelector('#comment-body').textContent;
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


          if(response.status == 200){
            console.log("Edit post success");
            const postID = await response.text()
            window.location.href = "/postPage/"+postID;
          }else
            console.error(`An error has occured. Status code = ${response.status}`); 
   
      });
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

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('comment-body')) {
        e.preventDefault();
  
        commentIntance = e.target.closest('.comment-bar');
        const index = commentIntance.getAttribute('data-postID');
        console.log("POST INDEX", index);
  
        window.location.href = "/postPage/"+index;
  
    }
  });
