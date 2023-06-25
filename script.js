const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');
const channel2 = new BroadcastChannel('myChannel');

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

const createPost = document.querySelector('#createpost');
const createpostForm = document.querySelector('#createpost-form');

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

    post_container.push(post_Data);

    opendocument = window.open("../MCO1/post.html");

    localStorage.setItem('post_Data', JSON.stringify(post_container[postCount]));

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
        var ID = parseInt(JSON.parse(localStorage.getItem('post_Data')).id);
        console.log(ID);
        post_container[ID] = JSON.parse(localStorage.getItem('post_Data'));
    }
}



