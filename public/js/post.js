const profileBtn2 = document.querySelector('.profileBtn');
const dropdownContent2 = document.querySelector('.dropdown');
const postie2 = document.querySelector('.header_text');

const submitBtn = document.getElementById("submit-comment");
const formElement = document.forms.commentform;

const commentSection = document.querySelector('#comment-section');

postie2.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "/loggedIn"
})

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');

const likeBtn = document.querySelector('.like');
const dislikeBtn = document.querySelector('.dislike');

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
    }else{
        /*-------------------------Registering user/logging in--------------------------------------*/
    
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
    
                if (response.status == 200)
                    console.log("Register Successful");
                else
                    console.error(`An error has occurred, Status code = ${response.status}`);
                 
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
            }
            else
                console.error(`An error has occured, Status code = ${response.status}`);
    
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

  