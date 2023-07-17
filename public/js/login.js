const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');

const channel2 = new BroadcastChannel('myChannel');

const createPost = document.querySelector('#createpost');
const createpostForm = document.querySelector('#createpost-form');

var users = JSON.parse(localStorage.getItem('users'));
var userDataInstance = users[parseInt(localStorage.getItem('user_id'))];

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

createPost.addEventListener('click', (e)=> {
    createpostForm.classList.add('show');
});

const postSubmit = document.querySelector('#submit-post');

/*
const item = `<div class="post-instance">
    <div class = "interactions">
        <div class="like-sprite"></div>
        <div class="like-count"> ${post_Data.likeCount}</div>
        <div class="comment-sprite"></div>
        <div class="comment-count">${post_Data.commentCount}</div>
    </div>
    <span class="index-title"><button class="post-button">${post_Data.title}</button><span>
    <span class="id" hidden>${post_Data.id}</span>
    </div>`
*/

postSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const title = document.querySelector('#titlepost').value;
    const body = document.querySelector('#postbody').value;

    console.log("login.js data", {title, body});
    const jString = JSON.stringify({title, body});

    const response = await fetch("/post", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    });

    createpostForm.classList.remove('show');

    if(response.status == 200){
        console.log("Post success");
        const postID = await response.text()
        window.location.href = "/postPage/"+postID;
    }else
        console.error(`An error has occured. Status code = ${response.status}`);
});


const exitpostform = document.querySelector('.exit');

exitpostform.addEventListener('click', (e) => {
    e.preventDefault();
    createpostForm.classList.remove('show');
})

const clickpostButtons = document.querySelectorAll('.post-button');

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('post-button')) {
        e.preventDefault();

        postIntance = e.target.closest('.post-instance');
        const index = postIntance.dataset.index;
        console.log("POST INDEX", index);

        window.location.href = "/postPage/"+index;

    }
});

const clickprofile = document.querySelector('.dropdown-content a:first-child');

clickprofile.addEventListener('click', async (e) =>{
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