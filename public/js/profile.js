const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');
const postie = document.querySelector('.header_text');

var modal = document.getElementById("editProfileModal");
var btn = document.getElementById("editProfile");
var span = document.getElementsByClassName("close")[0];
var saveBtn = document.getElementById("saveChanges");
var isMouseDownInModal = false;

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

postie.addEventListener('click', e => {
    window.location.href = "login.html";
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

const editPost = document.querySelectorAll('.edit-post-button');
const editpostForm = document.querySelector('#editpostform'); 

editPost.forEach(button =>{
  button.addEventListener('click', (a) => {
      editpostForm.classList.add('show');

      const exitpostform = document.querySelector('.exit');

      exitpostform.addEventListener('click', (e) => {
          e.preventDefault();
          editpostForm.classList.remove('show');
      })

      const submitPost = document.querySelector('#submit-post');

      const postInstance = a.target.closest('.post-instance');
      const postID = postInstance.dataset.index;
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

          editpostForm.classList.remove('show');

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



      /*
  // For now, we will just update the profile box directly
    document.querySelector(".profile-info h1").textContent = newUsername;
    document.querySelector(".bottom-section p").textContent = newBio;
    document.querySelector(".bottom-section h2").textContent = "Birthday: " + newBday;
    modal.style.display = "none";
    */

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










