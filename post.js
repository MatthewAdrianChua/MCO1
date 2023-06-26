const profileBtn2 = document.querySelector('.profileBtn');
const dropdownContent2 = document.querySelector('.dropdown');
const postie2 = document.querySelector('.header_text');

var postDocument = document;
const submitBtn = document.getElementById("submit-comment");
const formElement = document.forms.commentform;
const channel = new BroadcastChannel('myChannel');

post_Data = JSON.parse(localStorage.getItem('post_Data'));

let user_DataInstance = JSON.parse(localStorage.getItem('user_data'));

const commentSection = document.querySelector('#comment-section');

var commentIDs = post_Data.commentuserID;

document.querySelector('.counter').innerHTML = post_Data.likeCount;
document.querySelector('.post-title').innerHTML = post_Data.title;
document.querySelector('.body').innerHTML = post_Data.body;

profileBtn2.addEventListener('click', e => {
    dropdownContent2.classList.toggle('show-menu');
}); 

postie2.addEventListener('click', e => {
    window.location.href = "login.html";
    channel.postMessage("Main page request");
});

const clickprofile2 = document.querySelector('.dropdown-content a:first-child');

clickprofile2.addEventListener('click', (e) =>{
    localStorage.setItem('userDataInstance', JSON.stringify(user_DataInstance));
    const newWindow = window.open("../MCO1/profile.html");
})

function getCommentThread(){ //sets all comments and replies to be used after submitting one
    var tempcomment = [];
    var tempcommentpic = [];
    var tempcommentname = [];
    var tempcommentID = [];
    var comments = document.querySelectorAll('.comment-thread');
    for(let x = 0; x < comments.length; x++){
        var commentInstance = comments[x].querySelectorAll('.comment-instance');
        tempcomment.push([commentInstance[0].querySelector('.comment-body').textContent]);
        tempcommentpic.push([commentInstance[0].querySelector('.comment-profile').src]);
        tempcommentname.push([commentInstance[0].querySelector('.comment-name').textContent]);
        tempcommentID.push([[post_Data.id, x, 0, commentIDs[x][0]]]);


        for(let y = 1; y < commentInstance.length; y++){
            console.log(y);
            tempcomment[x].push(commentInstance[y].querySelector('.comment-body').textContent);
            tempcommentpic[x].push(commentInstance[y].querySelector('.comment-profile').src);
            tempcommentname[x].push(commentInstance[y].querySelector('.comment-name').textContent)
            tempcommentID[x].push([post_Data.id, x, y, commentIDs[x][y]]); //the 3rd index or 4th place contains the user id,also problem with edit post not saving properly after first edit on the same profile page
        
        }
    }
    post_Data.comment = tempcomment;
    post_Data.commentname = tempcommentname;
    post_Data.commentpic = tempcommentpic;
    post_Data.commentID = tempcommentID;
    post_Data.commentuserID = commentIDs;
}

function setCommentThread(){
    for(let x = 0; x < post_Data.comment.length; x++){
        var commentbody = post_Data.comment[x][0];
        var commentname = post_Data.commentname[x][0];
        var commentpic = post_Data.commentpic[x][0];
        var commentUserID = post_Data.commentuserID[x][0];
        console.log('user-id',commentUserID);
        const item = `<div class="comment-thread">
            <div class="comment-instance">
                <div class="comment-header">
                    <img class="comment-profile" src="${commentpic}">
                    <div class="comment-name" data-index= ${commentUserID}>${commentname}</div>
                </div>
            <div class="comment-body">
                ${commentbody}
            </div>
            <div>
                <button class="reply-button" data-index= ${x}>Reply</button>
            </div>
        </div>
    </div>`;

        commentSection.innerHTML += item;
        
        
        for(let y = 1; y < post_Data.comment[x].length; y++){
            var replyname = post_Data.commentname[x][y];
            var replypic = post_Data.commentpic[x][y];
            var replybody = post_Data.comment[x][y];
            commentUserID = post_Data.commentuserID[x][y];
            console.log('user-id',commentUserID);

            var comments = commentSection.querySelectorAll('.comment-thread');
            var commentInstance = comments[x];

            const replyItem = `
                <div class="comment-instance">
                    <div class="comment-header">
                        <img class="comment-profile" src="${replypic}">
                        <div class="comment-name" data-index= ${commentUserID}>${replyname}</div>
                    </div>
                    <div class="comment-body">
                        ${replybody}
                    </div>
                </div>
            `;
            const replyContainer = commentInstance.querySelector('.comment-body + div');
            replyContainer.innerHTML += replyItem;
        }
    }
}

setCommentThread();

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(formElement);
    const commenttext = formData.get("comment-input");

    const item = `<div class="comment-thread">
    <div class="comment-instance">
        <div class="comment-header">
            <img class="comment-profile" src="../MCO1/profile.jpg">
            <div class="comment-name" data-index= ${user_DataInstance.id}>Placeholder</div>
        </div>
        <div class="comment-body">
            ${commenttext}
        </div>
        <div>
            <button class="reply-button" data-index= ${post_Data.comment.length}>Reply</button>
        </div>
    </div>
    </div>`;

    commentSection.innerHTML += item;

    console.log('user id', user_DataInstance.id);
    commentIDs.push([user_DataInstance.id]);
    
    post_Data.commentCount++;   

    
    getCommentThread();
    
    localStorage.setItem('post_Data', JSON.stringify(post_Data));
    
    channel.postMessage("Post Submitted");
});

let comments = document.querySelectorAll('.reply-button')


commentSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('reply-button')) {
        console.log("Button was pressed");

        const commentInstance = e.target.closest('.comment-instance');
        const index = e.target.dataset.index;

        const replyFormExists = commentInstance.querySelector('.reply-form');
        if (replyFormExists) return; // Prevent creating multiple reply forms

        const item = `<form class="reply-form">
            <input class="reply-input" type="text" placeholder="reply"><br></input>
            <input class="submit-reply" type="submit" value="Submit">
        </form>`;

        commentInstance.innerHTML += item;

        const replyForm = commentInstance.querySelector('.reply-form');
        replyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const replyInput = replyForm.querySelector('.reply-input');
            const replyText = replyInput.value;

            const replyItem = `
                <div class="comment-instance">
                    <div class="comment-header">
                        <img class="comment-profile" src="../MCO1/profile.jpg">
                        <div class="comment-name" data-index= ${user_DataInstance}>Placeholder</div>
                    </div>
                    <div class="comment-body">
                        ${replyText}
                    </div>
                </div>
            `;

            const replyContainer = commentInstance.querySelector('.comment-body + div');
            replyContainer.innerHTML += replyItem;
            replyForm.remove();

            commentIDs[index].push(user_DataInstance.id);
            console.log('commentid',commentIDs[index]);
            
            post_Data.commentCount++;    
            
            getCommentThread();  
            
            localStorage.setItem('post_Data', JSON.stringify(post_Data));
            channel.postMessage("Post Submitted");
            
        });
    }
});

const likeBtn = document.querySelector('.like');

likeBtn.addEventListener('click' , (e) => {
    post_Data.likeCount++;
    document.querySelector('.counter').innerHTML = post_Data.likeCount;
    localStorage.setItem('post_Data', JSON.stringify(post_Data));
    channel.postMessage("Post Submitted");
    
})

const dislikeBtn = document.querySelector('.dislike');

dislikeBtn.addEventListener('click' , (e) => {
    post_Data.likeCount--;
    document.querySelector('.counter').innerHTML = post_Data.likeCount;
    localStorage.setItem('post_Data', JSON.stringify(post_Data));
    channel.postMessage("Post Submitted");
})

commentSection.addEventListener('click', (e) => {
    if (e.target.matches('.comment-name')) {
      e.preventDefault();
      const clickedElement = e.target;
      console.log(clickedElement.dataset.index);
      localStorage.setItem('user_id', clickedElement.dataset.index);
      window.open('../MCO1/profile.html');
    }
  });
  
