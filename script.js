const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');


profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 