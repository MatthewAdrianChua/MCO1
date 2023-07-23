const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');

const channel2 = new BroadcastChannel('myChannel');

const createPost = document.querySelector('#createpost');
const createpostForm = document.querySelector('#createpost-form');

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

createPost.addEventListener('click', (e)=> {
    createpostForm.classList.add('show');
});

const postSubmit = document.querySelector('#submit-post');

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

const clickprofile = document.querySelector('.dropdown-content ul li:first-child');

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


const nextPageBtn = document.querySelector("#nextPage");
let pageID = 0;
const paginationElement = document.getElementById("pagination");
pageID = parseInt(paginationElement.dataset.totalPages);

nextPageBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    pageID++;
    window.location.href = `/loggedin/${pageID}`;
});

const prevPageBtn = document.querySelector("#prevPage");

prevPageBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (pageID > 0) {
        pageID--;
    }
    window.location.href = `/loggedin/${pageID}`;
});