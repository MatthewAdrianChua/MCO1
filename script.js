const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('#logregbtn');
const wrapperBtnClose = document.querySelector('.closelogreg');
const createPost = document.querySelector('#createpost');

const channel4 = new BroadcastChannel('myChannel');

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
const users = [];
var usercount = 0;

class userData{
    constructor(){
        this.id = 0;
        this.name = "";
        this.email = "";
        this.password = "";
        this.bio = ""
        this.birthday = "";
        this.userposts = [];
        this.usercomments = []; //2d array the first column of a row is the postid the second column is the row in commentarray and the third column is the column in th commentarray
    }
}

function makeUserInstance(name, bio, birthday, userposts, usercomments){
    let user = new userData();
    user.id = usercount;
    usercount++;
    user.name = name;
    user.bio = bio;
    user.birthday = birthday;
    user.userposts = userposts;
    user.usercomments = usercomments;

    users.push(user);
}

makeUserInstance("Matt", "Hi Im Matt", "05/09/2003", [0,1], [[0,0,0]])
makeUserInstance("Ysabelle", "Hi Im Ysabelle", "05/09/2003", [2,3], [[0,0,1]])
makeUserInstance("John", "Hi Im John", "05/09/2003", [4], [[0,0,2]])

registerSumbit.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        var user = new userData();
        user.id = usercount;
        usercount++;
        user.name = document.querySelector('#regname').value;
        user.email = document.querySelector('#regemail').value;
        user.password = document.querySelector('#regpassword').value;
        users.push(user);
        localStorage.setItem('user_id', JSON.stringify(user.id));
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = "../MCO1/login.html";
    })
})

channel4.onmessage = function(event){ //to receive when a user saves their edited profile
    if(event.data == "Profile Saved"){
        var user_id = JSON.parse(localStorage.getItem('user-data')).id;
        users[user_id] = JSON.parse(localStorage.getItem('user-data'))
    }
}




