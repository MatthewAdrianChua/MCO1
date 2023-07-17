const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');
const postie = document.querySelector('.header_text');

var modal = document.getElementById("editProfileModal");
var btn = document.getElementById("editProfile");
var span = document.getElementsByClassName("close")[0];
var saveBtn = document.getElementById("saveChanges");
var isMouseDownInModal = false;

const userDataInstance2 = JSON.parse(localStorage.getItem('user_data'));

const channel3 = new BroadcastChannel('myChannel');

document.querySelector('.profile-info  h1').innerHTML = userDataInstance2.name;
document.querySelector('.bottom-section p').innerHTML = userDataInstance2.bio;
document.querySelector('.bottom-section h2:first-of-type').innerHTML = userDataInstance2.birthday;
document.querySelector('.bottom-section h2:nth-of-type(2)').innerHTML = "Posts: "+userDataInstance2.userposts.length;

async function loadPostData() {
    return new Promise((resolve, reject) => {
      channel3.postMessage('Request post data');
  
      channel3.onmessage = function(event) {
        if (event.data === 'Post container data sent') {
          const post_data_container = JSON.parse(localStorage.getItem('post_data_container'));
          resolve(post_data_container);
        } else {
          reject('Data not loaded');
        }
      };
    });
  }
  
  async function setPostContents() {
    try {
      const post_data_container = await loadPostData();
  
      let likeCounts = 0;
      let commentCounts = 0;
      let titles = 0;
      let ids = 0;
  
      console.log('total posts', post_data_container.length);
      console.log('user posts', userDataInstance2.userposts.length);
  
      for (let x = 0; x < userDataInstance2.userposts.length; x++) {
        const post = post_data_container[userDataInstance2.userposts[x]];
        likeCounts = post.likeCount;
        commentCounts = post.commentCount;
        titles = post.title;
        ids = post.id;
  
        const item = `<div class="post-instance">
          <div class="interactions">
            <div class="like-sprite"></div>
            <div class="like-count">${likeCounts}</div>
            <div class="comment-sprite"></div>
            <div class="comment-count">${commentCounts}</div>
          </div>
          <span class="index-title"><button class="post-button">${titles}</button><span>
          <span class="id">${ids}</span>
          <button class="edit-post-button" value="${ids}">edit post</button>
        </div>`;
  
        document.querySelector('.post-container').innerHTML += item;

        const editPost = document.querySelectorAll('.edit-post-button');
        const editpostForm = document.querySelector('#editpost-form'); 

        editPost.forEach(button =>{
            button.addEventListener('click', (a) => {
                editpostForm.classList.add('show');

                const exitpostform = document.querySelector('.exit');

            exitpostform.addEventListener('click', (e) => {
                e.preventDefault();
                editpostForm.classList.remove('show');
            })

            const submitPost = document.querySelector('#submit-post')

            submitPost.addEventListener('click', (e) => {
            e.preventDefault();

            let postid = parseInt(a.target.value);

            console.log(postid);

            post_data_container[postid].title = document.querySelector('#title-post').value;
            post_data_container[postid].body =  document.querySelector('#post-body').value;
        
            opendocument = window.open("../MCO1/post.html");
        
            localStorage.setItem('post_Data', JSON.stringify(post_data_container[postid]));
            localStorage.setItem('edited post data', JSON.stringify(post_data_container[postid]));
            channel3.postMessage("Post edited");
        
            editpostForm.classList.remove('show');
            console.log('postedited');
            })
        })
        
        })

        document.addEventListener('click', (e) => {
          if (e.target.classList.contains('post-button')) {
          e.preventDefault();
      
          const postInstance = e.target.closest('.post-instance');
          var postID = parseInt(postInstance.querySelector('.id').textContent ,10);
      
          localStorage.setItem('post_Data', JSON.stringify(post_data_container[postID]));
          window.open("../MCO1/post.html");
          }
        });

      }

      async function loadCommentData(){
        return new Promise((resolve, reject) => {
          channel3.postMessage('Request post data');
      
          channel3.onmessage = function(event) {
            if (event.data === 'Post container data sent') {
              const post_data_container = JSON.parse(localStorage.getItem('post_data_container'));
              resolve(post_data_container);
            } else {
              reject('Data not loaded');
            }
          };
        });
      }
      
      async function setCommentContents(){
        try{
          const post_data_container2 = await loadCommentData();
        console.log('comments',post_data_container2.length)
        const userCommentData = [];
        for(let x = 0; x < post_data_container2.length; x++){ //iterates through every post
          for(let y = 0; y < post_data_container2[x].comment.length; y++){ //iterates through every comment thread in the post
               for(let z = 0; z < post_data_container2[x].commentID[y].length; z++ ){   //iterates through every comment in the comment thread
                if(post_data_container2[x].commentID[y][z][3] === userDataInstance2.id){
                let i = post_data_container2[x].commentID[y][z][1];
                let j = post_data_container2[x].commentID[y][z][2];
                let commentBody = post_data_container2[x].comment[i][j];
                userCommentData.push(post_data_container2[x].commentID[y][z]);
                const item = `<div class="comment-bar">
                <span class="comment-title"> comment on ___'s post </span>
                <span class="comment-body" id="comment-body">:  ${commentBody} </span>
                <input type="text" id="edit-comment-body" style="display: none;" />
                <button class="save-button" style="display: none;">Save</button>
                <button class="edit-button"> edit </span>
                </div>`
      
              document.querySelector('.post-footer').innerHTML += item;
            }
               }                                                       
              
            }
          }
          console.log(document.querySelector('.post-footer'));

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
          
              save.addEventListener('click', () => {
                commentInstance.querySelector("#comment-body").textContent = commentInstance.querySelector("#edit-comment-body").value;
                commentInstance.querySelector("#comment-body").style.display = "inline-block";
                commentInstance.querySelector("#edit-comment-body").style.display = "none";
                commentInstance.querySelector(".save-button").style.display = "none";
                console.log(userCommentData);
                post_data_container2[userCommentData[x][0]].comment[userCommentData[x][1]][userCommentData[x][2]] = commentInstance.querySelector('#edit-comment-body').value;
                console.log(post_data_container2[userCommentData[x][0]].comment[userCommentData[x][1]][userCommentData[x][2]]);
                localStorage.setItem('edited post data', JSON.stringify(post_data_container2[userCommentData[x][0]]));
                channel3.postMessage('Post edited');
              });
            });
          }
          
        }catch(error){
          console.log(error);
        }
      }

      setCommentContents();
    } catch (error) {
      console.log(error);
    }
  }  

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

postie.addEventListener('click', e => {
    window.location.href = "login.html";
    channel3.postMessage("Main page request");
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


saveBtn.onclick = function() {
    var newUsername = document.getElementById("newUsername").value;
    var newBio = document.getElementById("newBio").value;
    var newBday = document.getElementById("newBday").value;
  // Here you would typically send the new data to the server and get a response

    userDataInstance2.name = newUsername; /*issue here is since the edit box on first edit is empty user has to type all text again only for the first time though same for these 3*/
    userDataInstance2.bio = newBio;
    userDataInstance2.birthday = newBday;

    channel3.postMessage("Profile Saved");

    localStorage.setItem('user_data', JSON.stringify(userDataInstance2));

  // For now, we will just update the profile box directly
    document.querySelector(".profile-info h1").textContent = newUsername;
    document.querySelector(".bottom-section p").textContent = newBio;
    document.querySelector(".bottom-section h2").textContent = "Birthday: " + newBday;
    modal.style.display = "none";

}

setPostContents();





/*===================================EDIT POST========================*/


