const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');
const postPopup = document.querySelector('#createpost');
const postThread = document.getElementById('#post-thread');
let logStatus = true;

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

postPopup.addEventListener('click', ()=> {
    if(logStatus){
        const post = `
        <a class="post-button" href="#">
            <div class="post-wrapper">
                <ion-icon name="caret-up-circle-outline"></ion-icon>
                <p class="post-numbers" id="">0</p>
                <ion-icon name="caret-up-circle-outline"></ion-icon>
                <p class="post-numbers">0</p>
                <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                <p class="post-numbers">0</p>
                <p class="post-title">Lorem Ipsum Something Something</p>
                <p class="post-author">By:Lorem Ipsum</p>
            </div>
        </a>`;
        postThread.innerHTML += post;
    }else{
        wrapper.classList.add('active-popup');
    }
});
