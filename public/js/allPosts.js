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
    if (e.target.classList.contains('post-button')) {
        e.preventDefault();
  
        postIntance = e.target.closest('.post-instance');
        const index = postIntance.getAttribute('data-ID');
        console.log("POST INDEX", index);
  
        window.location.href = "/postPage/"+index;
  
    }
  });
