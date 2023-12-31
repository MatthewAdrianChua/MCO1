const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');
const createPost = document.querySelector('#createpost');

const wrongCredentials = document.querySelector('.wrongCredentials');
const wrongRegister = document.querySelector('.wrongRegister');

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

createPost.addEventListener('click', (e) => {
    wrapper.classList.add('active-popup')
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
        const f = false;
        const jString2 = JSON.stringify({email, password, f});

       
        const response = await fetch("/register", {
            method: "POST",
            body: jString,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status == 200){
            console.log("Register Successful");
            wrongRegister.classList.add('show');
            wrongRegister.textContent = 'Registering Success!'
            wrongRegister.style.color = "#0081A7";
           
            const response2 = await fetch("/login",{
                method: "POST",
                body: jString,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response2.status == 200){
                window.location.href = "/loggedIn"; 
            }
            else{
                console.error(`An error has occured, Status code = ${response.status}`);
                wrongCredentials.classList.add('show');
            }
        }
        else{
            console.error(`An error has occurred, Status code = ${response.status}`);
            wrongRegister.classList.add('show');
            wrongRegister.textContent = 'Registering Failed'
            wrongRegister.style.color = "red";
        }
             
    })
})

const loginSubmit = document.querySelector('.submitbtnlog');

loginSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#logemail').value;
    const password = document.querySelector('#logpassword').value;

    console.log("in script.js",{email, password});

    let rememberStatus = false;

    if(document.querySelector('.remember-forgot input').checked){
        rememberStatus = true;
    }

    const jString = JSON.stringify({email, password, rememberStatus});
    console.log(jString);

    const response = await fetch("/login", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(response.status == 200){
        console.log("Login Successful");
        wrongCredentials.classList.remove('show');
        window.location.href = "/loggedIn"; //not sure if this is the correct way to do redirect after a login
    }
    else{
        console.error(`An error has occured, Status code = ${response.status}`);
        wrongCredentials.classList.add('show');
    }

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

const nextPageBtn = document.querySelector("#nextPage");
const prevPageBtn = document.querySelector("#prevPage");

nextPageBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const nextPage = 1; 
    const jString = JSON.stringify({nextPage});
    const response = await fetch("/changePage", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    });
    window.location.href = "/page";
})

prevPageBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const nextPage = -1; 
    const jString = JSON.stringify({nextPage});
    const response = await fetch("/changePage", {
        method: "POST",
        body: jString,
        headers: {
            "Content-Type": "application/json"
        }
    });
    window.location.href = "/page";
})

const showNext = nextPageBtn.getAttribute('data-next');
const showPrev = prevPageBtn.getAttribute('data-prev');

console.log(showNext);

if(showNext == "true"){
    nextPageBtn.classList.add('show');
}else{
    nextPageBtn.classList.remove('show');
}

if(showPrev == "true"){
    prevPageBtn.classList.add('show');
}else{
    prevPageBtn.classList.remove('show');
}

const about = document.querySelector('#about');

about.addEventListener('click', async (e) => {
    const response = await fetch('/about', {
        method: "GET"
    })
    window.location.href = "/about";
})

