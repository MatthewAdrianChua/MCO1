const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');

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


postSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    title = document.querySelector('#title-post').value;
    localStorage.setItem('title', title);
    body = document.querySelector('#post-body').value;
    localStorage.setItem('body', body);

    window.open("post.html");

    likeCount =  localStorage.getItem('likeCount');
    commentCount = localStorage.getItem('commentCount');

    const item = `<div class="post-instance">
    <div class = "interactions">
        <ion-icon name="caret-up-circle-outline"></ion-icon>
        <div class="like-count"> ${likeCount}</div>
        <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
        <div class="comment-count">${commentCount}</div>
    </div>
    <div class="index-title"> <a href="post.html" id="index-title-link">${title}</a><div>
    </div>`

    document.querySelector('.posts-container').innerHTML += item;

    createpostForm.classList.remove('show');

})

const exitpostform = document.querySelector('.exit');

exitpostform.addEventListener('click', (e) => {
    e.preventDefault();
    createpostForm.classList.remove('show');
})



