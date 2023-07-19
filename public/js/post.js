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

profileBtn2.addEventListener('click', e => {
    dropdownContent2.classList.toggle('show-menu');
}); 

const clickprofile2 = document.querySelector('.dropdown-content a:first-child');

clickprofile2.addEventListener('click', async (e) =>{
    e.preventDefault();
    
    e.preventDefault();

    const get = await fetch("/getCurrentUser", {
        method: "GET"
      });
    
      let currentUser;
    
      if(get.status == 200){
        currentUser = await get.text();
      }else{
        console.error(`An error has occured. Status code = ${response.status}`); 
      }

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

const likeBtn = document.querySelector('.like');
const dislikeBtn = document.querySelector('.dislike');

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

commentSection.addEventListener('click', (e) => {
    if (e.target.matches('.comment-name')) {
        e.preventDefault();
      
        const userInstance = e.target.closest('.comment-header');
        const index = userInstance.dataset.index;
        console.log("USER INDEX", index);

        window.location.href = "/profile/"+index;
    }
});
  