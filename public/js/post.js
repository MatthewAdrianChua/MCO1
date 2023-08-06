const profileBtn2 = document.querySelector('.profileBtn');
const dropdownContent2 = document.querySelector('.dropdown');
const postie2 = document.querySelector('.header_text');

const submitBtn = document.getElementById("submit-comment");
const formElement = document.forms.commentform;

const commentSection = document.querySelector('#comment-section');

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');

const likeBtn = document.querySelector('.like');
const dislikeBtn = document.querySelector('.dislike');

const wrongCredentials = document.querySelector('.wrongCredentials');
const wrongRegister = document.querySelector('.wrongRegister');

function search(){
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
        window.location.href= "/search";
        if(response.status == 200){
            console.log("Search Success")
        }
    })

    const logoBtn = document.querySelector(".logo");

    logoBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        window.location.href = "/";
    })
}

function search1(){
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
}

async function loadProfile(){ //this function will load the profile icon with drop down if a user is logged in if not otherwise it will load the login/register button
    const response = await fetch("/getCurrentUser", {
    method: "GET"
    })

    let currentUser = "";

    if(response.status == 200){
        currentUser = await response.text();
    }else{
        console.error(`An error has occured. Status code = ${response.status}`); 
    }

    if(currentUser != ""){
        postie2.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = "/loggedIn"
        })

        profileBtn2.addEventListener('click', e => {
            dropdownContent2.classList.toggle('show-menu');
        });
    
        const clickprofile2 = document.querySelector('.dropdown-content a:first-child');
    
        clickprofile2.addEventListener('click', async (e) =>{
            e.preventDefault();
    
            window.location.href = "/profile/"+currentUser;
        })

        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
        
            const formData = new FormData(formElement);
        
            const body = formData.get("comment-input");
            const currentUrl = window.location.href;
            const postID = currentUrl.substring(currentUrl.lastIndexOf('/') + 1); //gets the postID at the end of the current url 
            const parent = "";
        
            console.log("Submit comment data: ", {body, postID, parent});
        
            const jString = JSON.stringify({body, postID, parent});
        
            const response = await fetch("/comment", {
                method: "POST",
                body: jString,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        
            if(response.status == 200){
                console.log("Comment success");
                window.location.reload();
            }else
                console.error(`An error has occured. Status code = ${response.status}`);
        });
        
        commentSection.addEventListener('click', (e) => {
            if (e.target.classList.contains('reply-button')) {
                console.log("Button was pressed");
        
                const commentInstance = e.target.closest('.comment-instance');
                const index = commentInstance.dataset.index;
                console.log("INDEX", index);
        
                const item = `<form class="reply-form">
                    <input class="reply-input" type="text" placeholder="reply"><br></input>
                    <input class="submit-reply" type="submit" value="Submit">
                </form>`;
        
                commentInstance.innerHTML += item;
        
                const replyForm = commentInstance.querySelector('.reply-form');
                replyForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
        
                    const replyInput = replyForm.querySelector('.reply-input');
                    const body = replyInput.value;
        
        
                    const currentUrl = window.location.href;
                    const postID = currentUrl.substring(currentUrl.lastIndexOf('/') + 1); //gets the postID at the end of the current url 
                    const parent = index;
        
                    console.log("Submit comment data: ", {body, postID, parent});
        
                    const jString = JSON.stringify({body, postID, parent});
        
                    const response = await fetch("/comment", {
                    method: "POST",
                    body: jString,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if(response.status == 200){
                    console.log("Comment success");
                    window.location.reload();
                }else
                    console.error(`An error has occured. Status code = ${response.status}`);
        
                    replyForm.remove();
        
                });
            }
        });
        
        likeBtn.addEventListener('click' , async (e) => {
            const url = window.location.href;
        
            const parts = url.split("/");
            const value = parts[parts.length - 1];
        
            const jString = JSON.stringify({value});
            console.log(jString);
        
            const response = await fetch("/like", {
                method: "POST",
                body: jString,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        
            if(response.status == 200){
                console.log("Like success");
                window.location.reload();
            }else
                console.error(`An error has occured. Status code = ${response.status}`);
        
            
        })
        
        dislikeBtn.addEventListener('click' , async(e) => {
            const url = window.location.href;
        
            const parts = url.split("/");
            const value = parts[parts.length - 1];
        
            const jString = JSON.stringify({value});
            console.log(jString);
        
            const response = await fetch("/dislike", {
                method: "POST",
                body: jString,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        
            if(response.status == 200){
                console.log("Dislike success");
                window.location.reload();
            }else
                console.error(`An error has occured. Status code = ${response.status}`);
        })

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

        search1();
        
    }else{
        /*-------------------------Registering user/logging in--------------------------------------*/

        postie2.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = "/"
        })
    
        registerLink.addEventListener('click', () => {
            wrapper.classList.add('active')
        });
    
        loginLink.addEventListener('click', () => {
            wrapper.classList.remove('active')
        });
    
        btnPopup.addEventListener('click', ()=> {
            wrapper.classList.add('active-popup');
        });
    
        wrapperBtnClose.addEventListener('click', ()=> {
            wrapper.classList.remove('active-popup');
        });
    
        const registerSumbit = document.querySelectorAll('.submitbtnreg');
    
        registerSumbit.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
            
                const name = document.querySelector('#regname').value;
                const email = document.querySelector('#regemail').value;
                const password = document.querySelector('#regpassword').value;
    
                console.log("in script.js",{name, email, password});
                const jString = JSON.stringify({name, email, password});
    
                const response = await fetch("/register", {
                    method: "POST",
                    body: jString,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
    
                if (response.status == 200){
                    console.log("Register Successful");
                    wrongRegister.classList.add('show');
                    wrongRegister.textContent = 'Registering Success!'
                    wrongRegister.style.color = "#0081A7";
                }
                else{
                    console.error(`An error has occurred, Status code = ${response.status}`);
                    wrongRegister.classList.add('show');
                    wrongRegister.textContent = 'Registering Failed'
                    wrongRegister.style.color = "red";
                }
                 
            })
        })
    
        const loginSubmit = document.querySelector('.submitbtnlog');
    
        loginSubmit.addEventListener('click', async (e) => {
            e.preventDefault();
    
            const email = document.querySelector('#logemail').value;
            const password = document.querySelector('#logpassword').value;
    
            console.log("in script.js",{email, password});
            const jString = JSON.stringify({email, password});
    
            const response = await fetch("/login", {
                method: "POST",
                body: jString,
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if(response.status == 200){
                console.log("Login Successful");
                window.location.reload(); //not sure if this is the correct way to do redirect after a login
                wrongCredentials.classList.remove('show');
            }
            else
                console.error(`An error has occured, Status code = ${response.status}`);
                wrongCredentials.classList.add('show');
    
        })

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault
            wrapper.classList.add('active-popup');
        })

        commentSection.addEventListener('click', (e) => {
            e.preventDefault
            wrapper.classList.add('active-popup');
        })

        likeBtn.addEventListener('click', (e) => {
            e.preventDefault
            wrapper.classList.add('active-popup');
        })

        dislikeBtn.addEventListener('click', (e) => {
            e.preventDefault
            wrapper.classList.add('active-popup');
        })

        search();

    }
}
loadProfile();

commentSection.addEventListener('click', (e) => {
    if (e.target.matches('.comment-name')) {
        e.preventDefault();
      
        const userInstance = e.target.closest('.comment-header');
        const index = userInstance.dataset.index;
        console.log("USER INDEX", index);

        window.location.href = "/profile/"+index;
    }
});

const posterInfo = document.querySelector('.posterInfo');

posterInfo.addEventListener('click', (e) => {
    const index = posterInfo.dataset.index;

    window.location.href = "/profile/"+index;
})

const isLiked = likeBtn.dataset.index;
const isDisliked = dislikeBtn.dataset.index;
const counter = document.querySelector('.counter');

if(isLiked == "true"){
    counter.style.color = '#0081A7';
    likeBtn.style.backgroundPosition = "-605px -520px";
}
else if(isDisliked == "true"){
    counter.style.color = "red";
    dislikeBtn.style.backgroundPosition = "-386px -520px";
}
else
{
    counter.style.color = "black";
}
if(isLiked == "false"){
    likeBtn.style.backgroundPosition = "-550px -520px";
}
if(isDisliked == "false"){
    dislikeBtn.style.backgroundPosition = "-331px -520px";
}

/*-----------------------------*/

var editButton = document.querySelectorAll('.edit-comment-button');


for (let x = 0; x < editButton.length; x++) {
    editButton[x].addEventListener("click", (e) => {
      let commentInstance = e.target.closest('.comment-instance');
      commentInstance.querySelector(".comment-body").style.display = "none";
      commentInstance.querySelector(".edit-comment-body").value = document.getElementById("comment-body").textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
      commentInstance.querySelector(".edit-comment-body").style.display = "inline-block";
      commentInstance.querySelector(".save-button").style.display = "inline-block";
      
      let save = commentInstance.querySelector('.save-button');

      save.addEventListener('click', async() => {

          const postID = commentInstance.getAttribute('data-postID');
          const commentID = commentInstance.getAttribute('data-index');
          const commentBody = commentInstance.querySelector(".edit-comment-body").value;

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

const deleteComment = document.querySelectorAll('.delete-comment-button');

for (let x = 0; x < deleteComment.length; x++) {
    deleteComment[x].addEventListener("click", async (e) => {
        const commentInstance = e.target.closest('.comment-instance');
        const commentID = commentInstance.getAttribute('data-index');
        const postID = commentInstance.getAttribute('data-postID');

        console.log("info: ", commentID, postID);

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
        console.log('OKAY')
    }else{
        submitPost.disabled = true;
        submitPost.value = "Fill out all inputs!";
        submitPost.style.color = "red";
        console.log('ERROR')
    }
}

title.addEventListener('input', checkInputs);
body.addEventListener('input', checkInputs);

editPost.forEach(button =>{
    button.addEventListener('click', (a) => {
        editpostForm.classList.add('show');
       
         const exitpostform = document.querySelector('.exit');

        exitpostform.addEventListener('click', (e) => {
            e.preventDefault();
            editpostForm.classList.remove('show');
        })

        const postID = document.querySelector('.post-container').dataset.index;
        console.log("POST INDEX", postID);

        document.querySelector('#postbody').value = document.querySelector('.body').textContent;
        document.querySelector('#titlepost').value = document.querySelector('.post-title').textContent;

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
        const index = document.querySelector('.post-container').dataset.index;

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