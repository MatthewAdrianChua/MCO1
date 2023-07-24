const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');
const postie = document.querySelector('.header_text');

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');

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

async function loadProfile(){//if statement to load either the login/register button or the profile icon
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

      postie.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "/loggedIn"
      })

      profileBtn.addEventListener('click', e => {
        dropdownContent.classList.toggle('show-menu');
      });

      const clickprofile2 = document.querySelector('.dropdown-content a:first-child');

      clickprofile2.addEventListener('click', async (e) =>{
        e.preventDefault();

        window.location.href = "/profile/"+currentUser;
      })

      search1();
    }else{
      postie.addEventListener('click', (e) => {
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

      search();
    }
}

loadProfile();

const viewPosts = document.querySelector('#morePosts');

viewPosts.addEventListener('click', async (e) => {
    const index = viewPosts.dataset.index;
    console.log(index);
    window.location.href = '/profilePosts/'+index;
    
})

const viewComments = document.querySelector('#moreComments');

viewComments.addEventListener('click', async (e) => {
    const index = viewPosts.dataset.index;
    console.log(index);
    window.location.href = '/profileComments/'+index;   
})








