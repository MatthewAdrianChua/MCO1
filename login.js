const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');

const channel2 = new BroadcastChannel('myChannel');

const createPost = document.querySelector('#createpost');
const createpostForm = document.querySelector('#createpost-form');

var users = JSON.parse(localStorage.getItem('users'));
console.log(users);
var userDataInstance = users[parseInt(localStorage.getItem('user_id'))];


profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

createPost.addEventListener('click', (e)=> {
    createpostForm.classList.add('show');
});

const postSubmit = document.querySelector('#submit-post');

var postCount = 0;

class post_data{
    constructor(){
        this.id = 0;
        this.likeCount = 0;
        this.commentCount = 0;
        this.title = "";
        this.body = "";
        this.comment = [];//this holds every comment instance
        this.commentname = [];
        this.commentpic = [];
        this.userid = 0;
        this.commentID =[]; //id is in this format postid, the row/comment it is in, the column in the row it is in, userid who made it
        this.commentuserID = []; //the order of users in the comment thread
    }
}

var post_container = [];

postSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    var post_Data = new post_data();

    post_Data.id = postCount; //id will correspond to the index in post container
    post_Data.title = document.querySelector('#title-post').value;
    post_Data.body = document.querySelector('#post-body').value;
    post_Data.likeCount = 0;
    post_Data.commentCount = 0;
    userDataInstance.userposts.push(post_Data.id);

    post_container.push(post_Data);

    opendocument = window.open("../MCO1/post.html");

    localStorage.setItem('post_Data', JSON.stringify(post_container[postCount]));
    localStorage.setItem('post_data_container', JSON.stringify(post_container));
    localStorage.setItem('user_data', JSON.stringify(userDataInstance));

    const item = `<div class="post-instance">
    <div class = "interactions">
        <div class="like-sprite"></div>
        <div class="like-count"> ${post_Data.likeCount}</div>
        <div class="comment-sprite"></div>
        <div class="comment-count">${post_Data.commentCount}</div>
    </div>
    <span class="index-title"><button class="post-button">${post_Data.title}</button><span>
    <span class="id">${post_Data.id}</span>
    </div>`

    document.querySelector('.posts-container').innerHTML += item;

    createpostForm.classList.remove('show');

    console.log(userDataInstance.userposts);//post ids related to the current user
    console.log(post_container.length);

    postCount++;

})

const exitpostform = document.querySelector('.exit');

exitpostform.addEventListener('click', (e) => {
    e.preventDefault();
    createpostForm.classList.remove('show');
})

const clickpostButtons = document.querySelectorAll('.post-button');

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('post-button')) {
    e.preventDefault();

    const postInstance = e.target.closest('.post-instance');
    var postID = parseInt(postInstance.querySelector('.id').textContent ,10);

    localStorage.setItem('post_Data', JSON.stringify(post_container[postID]));
    window.open("../MCO1/post.html");
    }
});

channel2.onmessage = function(event){
    if(event.data == "Post Submitted"){
        var postID = parseInt(JSON.parse(localStorage.getItem('post_Data')).id);
        post_container[postID] = JSON.parse(localStorage.getItem('post_Data'));
        console.log('post submitted');
    }else if(event.data == "Request post data"){
        let currentstorage = post_container;
        localStorage.setItem('post_data_container', JSON.stringify(post_container));
        console.log('post amount from login.js', post_container.length);
        if(currentstorage != JSON.parse(localStorage.getItem('post_data_conatainer'))){
            channel2.postMessage('Post container data sent');
        }else{
            channel2.postMessage('Post container data not sent');
        }
    }else if(event.data == "Post edited"){
        var postID = parseInt(JSON.parse(localStorage.getItem('edited post data')).id);
        post_container[postID] = JSON.parse(localStorage.getItem('edited post data'));
        console.log("post edited");
    }else if(event.data == "Main page request"){
        console.log("reload");
        localStorage.setItem('userDataInstance', JSON.stringify(userDataInstance));
        localStorage.setItem('post_data_container', JSON.stringify(post_container));
    }
}

const clickprofile = document.querySelector('.dropdown-content a:first-child');

clickprofile.addEventListener('click', (e) =>{
    e.preventDefault();
    localStorage.setItem('user_data', JSON.stringify(userDataInstance));
    const newWindow = window.open("../MCO1/profile.html");
})

function addPostTemp(){
    let post = new post_data();
    post.id = postCount;
    postCount++;
    post.title = "Hi Im a post";
    post.body = "This is my post";
    post.likeCount = 5;
    post.commentCount = 0;
    post.comment.push(["WOW"]);
    post.commentname.push([users[0].name]);
    post.commentpic.push(["../MCO1/profile2.png"]);
    post.userid = 0;
    post.commentID.push([0,0,0,0]);
    post.commentuserID.push([0]);

    post.comment[0].push(["Thats Cool!"]);
    post.commentname[0].push([users[1].name]);
    post.commentpic[0].push(["../MCO1/profile.png"])
    post.commentID[0].push([0,0,1,1]);
    post.commentuserID[0].push(1);

    users[0].userposts.push(post.id);
    post_container.push(post);



    localStorage.setItem('post_data_container', JSON.stringify(post_container));
}


if(localStorage.getItem('post_data_container') == null && localStorage.getItem('userDataInstance') == null){
    localStorage.setItem('userDataInstance', JSON.stringify(userDataInstance)); //these 2 reduntant can be fixed
    localStorage.setItem('user_data', JSON.stringify(userDataInstance));
}


function loadposts(){
    post_container = JSON.parse(localStorage.getItem('post_data_container'));
    userDataInstance = JSON.parse(localStorage.getItem('userDataInstance'));
    postCount = post_container.length;
    for(let x = 0; x < post_container.length; x++){
        let likeCount = post_container[x].likeCount;
        let commentCount = post_container[x].commentCount;
        let title = post_container[x].title;
        let id = post_container[x].id;
        const item = `<div class="post-instance">
        <div class = "interactions">
        <div class="like-sprite"></div>
        <div class="like-count"> ${likeCount}</div>
        <div class="comment-sprite"></div>
        <div class="comment-count">${commentCount}</div>
        </div>
        <span class="index-title"><button class="post-button">${title}</button><span>
        <span class="id">${id}</span>
        </div>`

        document.querySelector('.posts-container').innerHTML += item;
    }
}

if(localStorage.getItem('post_data_container') && localStorage.getItem('userDataInstance')){
    loadposts();
}