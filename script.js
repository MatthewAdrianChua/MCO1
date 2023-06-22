const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const dropDown = document.querySelector('#profilePic');
const wrapperBtnClose = document.querySelector('.closelogreg');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active')
});

dropDown.addEventListener('click', () => {
    document.getElementById('myDropdown').classList.toggle('show');
});


btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
});

wrapperBtnClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
});
