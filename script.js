
/*============================EDIT PROFILE====================*/
const profileBtn = document.querySelector('.profileBtn');
const dropdownContent = document.querySelector('.dropdown');
const postie = document.querySelector('.header_text');

var modal = document.getElementById("editProfileModal");
var btn = document.getElementById("editProfile");
var span = document.getElementsByClassName("close")[0];
var saveBtn = document.getElementById("saveChanges");
var isMouseDownInModal = false;

profileBtn.addEventListener('click', e => {
    dropdownContent.classList.toggle('show-menu');
}); 

postie.addEventListener('click', e => {
    window.location.href = '/page/index.html';
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

  // For now, we will just update the profile box directly
    document.querySelector(".profile-info h1").textContent = newUsername;
    document.querySelector(".bottom-section p").textContent = newBio;
    document.querySelector(".bottom-section h2").textContent = "Birthday: " + newBday;
    modal.style.display = "none";
}


/*===================================EDIT POST========================*/
